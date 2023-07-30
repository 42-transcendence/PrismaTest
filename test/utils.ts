export function commandCodeExtract(buf : ArrayBuffer) : string
{
	const code = new Uint8Array(buf.slice(0, 1));
	if (code[0] == 48)
		return 'Enter';
	return 'error';
}

export function getLength(buf : ArrayBuffer) : number
{
	const length = new Uint8Array(buf.slice(0, 2));
	console.log(length[0] << 8 | length[1]);
	return length[0] << 8 | length[1];
}

export function stringToUnit8Array(msg : string) : Uint8Array
{
	const buf = new Uint8Array(msg.length);
	for (let i = 0; i < msg.length ; i++)
		buf[i] = msg.charCodeAt(i);
	return buf;
}