import { createReadStream } from "fs";
import { createBrotliCompress, createGzip } from "zlib";

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
