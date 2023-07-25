import { Controller, Get, Query } from '@nestjs/common';

// Reference: https://datatracker.ietf.org/doc/html/rfc4226
// Reference: https://datatracker.ietf.org/doc/html/rfc6238

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

function toHexString(arr: Uint8Array): string {
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHexString(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}

function encodeUtf8(message: string): Uint8Array {
  return new TextEncoder().encode(message);
}

async function digestMessage(
  algorithm: HashAlgorithm,
  data: Uint8Array,
): Promise<Uint8Array> {
  const hash: ArrayBuffer = await crypto.subtle.digest(algorithm, data);
  return new Uint8Array(hash);
}

async function hmacGenerateKey(
  algorithm: HashAlgorithm,
  length?: number,
): Promise<Uint8Array> {
  const generatedKey: CryptoKey = await crypto.subtle.generateKey(
    {
      name: 'HMAC',
      length,
      hash: { name: algorithm },
    },
    true,
    ['verify'],
  );
  const extractedKey: ArrayBuffer = await crypto.subtle.exportKey(
    'raw',
    generatedKey,
  );
  return new Uint8Array(extractedKey);
}

async function hmacSignature(
  algorithm: HashAlgorithm,
  key: Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  try {
    const cryptoKey: CryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      {
        name: 'HMAC',
        hash: { name: algorithm },
      },
      false,
      ['sign'],
    );
    const buffer: ArrayBuffer = await crypto.subtle.sign(
      { name: 'HMAC' },
      cryptoKey,
      data,
    );
    return new Uint8Array(buffer);
  } catch (e) {
    throw new Error(e);
  }
}

const DIGITS_POWER =
  //0   1    2     3      4       5        6         7          8
  [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

async function generateOTP(
  secret: Uint8Array,
  movingFactor: number,
  codeDigits: number,
  algorithm: HashAlgorithm,
): Promise<string> {
  // put movingFactor value into text byte array
  const text: Uint8Array = new Uint8Array(8);
  for (let i = text.length - 1; i >= 0; i--) {
    text[i] = movingFactor & 0xff;
    movingFactor >>= 8;
  }

  // compute hmac hash
  const hash: Uint8Array = await hmacSignature(algorithm, secret, text);

  // put selected bytes into result int
  const offset: number = hash[hash.length - 1] & 0xf;

  const binary: number =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp: number = binary % DIGITS_POWER[codeDigits];

  return otp.toString().padStart(codeDigits, '0');
}

@Controller('otp')
export class OtpController {
  @Get('hash-sha256')
  async hash_sha256(@Query('message') message: any) {
    const hash: Uint8Array = await digestMessage(
      'SHA-256',
      encodeUtf8(message),
    );
    return toHexString(hash);
  }

  @Get('keygen-sha256')
  async keygen_sha256() {
    const key: Uint8Array = await hmacGenerateKey('SHA-256');
    return toHexString(key);
  }

  @Get('sign-sha256')
  async sign_sha256(@Query('key') key: any, @Query('message') message: any) {
    const signature: Uint8Array = await hmacSignature(
      'SHA-256',
      fromHexString(key),
      encodeUtf8(message),
    );
    return toHexString(signature);
  }

  @Get()
  queryTime() {
    const period = 30;
    const time: number = Math.floor(Date.now() / 1000 / period);
    return time;
  }

  @Get('t')
  async totp(@Query('key') keyStr: any) {
    const digits = 6;
    const period = 30;
    const key: Uint8Array = fromHexString(keyStr);
    const time: number = Math.floor(Date.now() / 1000 / period);
    const expire: Date = new Date((time + 1) * period * 1000);
    return `<p>${await generateOTP(key, time, digits, 'SHA-256')}<hr/>
	Invalid after <time datetime="${expire.toISOString()}">${expire.toLocaleString()}</time></p>`;
  }

  @Get('h')
  async hotp(@Query('key') keyStr: any, @Query('counter') counter: any) {
    const digits = 6;
    const key: Uint8Array = fromHexString(keyStr);
    return await generateOTP(key, counter, digits, 'SHA-256');
  }

  @Get('qr')
  async qr() {
    // Reference: https://github.com/google/google-authenticator/wiki/Key-Uri-Format

    function base32_encode(array: Uint8Array): string {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      const result = new Array<string>();

      let shift = 3;
      let carry = 0;

      for (let i = 0; i < array.length; i++) {
        const data = array[i];

        {
          const val = carry | (data >> shift);
          result.push(alphabet[val & 0x1f]);
        }

        if (shift > 5) {
          const val = data >> (shift - 5);
          result.push(alphabet[val & 0x1f]);

          shift -= 5;
        }

        carry = data << (5 - shift);
        shift += 3;
      }

      if (shift !== 3) {
        result.push(alphabet[carry & 0x1f]);
      }

      return result.join('');
    }

    const key: Uint8Array = await hmacGenerateKey('SHA-256');
    const uri: URL = new URL('otpauth://');
    const digits = 6;
    const period = 30;
    let counter: number | undefined;
    uri.hostname = !counter ? 'totp' : 'hotp';
    uri.pathname = 'DEV:jkong@student.42seoul.kr';
    uri.searchParams.set('secret', base32_encode(key));
    uri.searchParams.set('issuer', 'DEV');
    uri.searchParams.set('algorithm', 'SHA256');
    uri.searchParams.set('digits', digits.toString());
    uri.searchParams.set('period', period.toString());
    if (counter) {
      uri.searchParams.set('counter', counter.toString());
    }

    //TODO: QR Code creation must be performed by the client.
    const QRCode = await import('qrcode');
    const svg = await QRCode.toString(uri.toString(), {
      errorCorrectionLevel: 'H',
      margin: 0,
      scale: 1,
      color: {
        dark: '#777f',
        light: '#0000',
      },
      type: 'svg',
    });
    return `${svg.replace('svg', 'svg style="max-height: 80vh;"')}
	<a href="./t?key=${toHexString(key)}">${toHexString(key)}</p>`;
  }
}