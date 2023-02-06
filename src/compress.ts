import zlib from "zlib";

export function getGzipSize(buffer: Buffer): Promise<number> {
	return new Promise((resolve, reject) => {
		zlib.gzip(buffer, (error, result) => {
			if (error) return reject(error);
			resolve(result.length);
		});
	});
}

export function getBrotliSize(buffer: Buffer): Promise<number> {
	return new Promise((resolve, reject) => {
		zlib.brotliCompress(buffer, (error, result) => {
			if (error) return reject(error);
			resolve(result.length);
		});
	});
}
