import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { createBrotliCompress, createGzip } from "zlib";

export async function getPlainSize(file: string): Promise<number> {
	return (await stat(file)).size;
}

export function getGzipSize(file: string): Promise<number> {
	return new Promise((resolve, reject) => {
		let size = 0;

		createReadStream(file)
			.pipe(createGzip())
			.on("data", chunk => (size += chunk.length))
			.on("error", reject)
			.on("end", () => resolve(size));
	});
}

export function getBrotliSize(file: string): Promise<number> {
	return new Promise((resolve, reject) => {
		let size = 0;

		createReadStream(file)
			.pipe(createBrotliCompress())
			.on("data", chunk => (size += chunk.length))
			.on("error", reject)
			.on("end", () => resolve(size));
	});
}
