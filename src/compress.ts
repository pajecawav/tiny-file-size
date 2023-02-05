import zlib from "zlib";

export function getGzipSize(buffer: Buffer): number {
	return zlib.gzipSync(buffer).length;
}

export function getBrotliSize(buffer: Buffer): number {
	return zlib.brotliCompressSync(buffer).length;
}
