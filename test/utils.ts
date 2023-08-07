const commandCode = {
	Enter: +1,
}

export interface BufType {
	buf: ArrayBuffer;
}

export function commandCodeExtract(buffer: BufType): string {
	const code = new Uint8Array(buffer.buf.slice(0, 1));
	buffer.buf = buffer.buf.slice(1)
	if (code[0] === commandCode["Enter"])
		return 'Enter';
	return 'error';
}

export function getLength(buffer: BufType): number {
	const length = new Uint8Array(buffer.buf.slice(0, 2));
	buffer.buf = buffer.buf.slice(2);
	return length[0] << 8 | length[1];
}

export function stringToUnit8Array(msg: string): Uint8Array {
	const buf = new Uint8Array(msg.length);
	for (let i = 0; i < msg.length; i++)
		buf[i] = msg.charCodeAt(i);
	return buf;
}