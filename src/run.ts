import { readFileSync } from "fs";
import { getBrotliSize, getGzipSize } from "./compress";
import { Config } from "./config";
import { reportConsole } from "./report";

export interface FileSize {
	file: string;
	plain: number;
	gzip: number;
	brotli: number;
}

export function getFileSizes(files: string[]): FileSize[] {
	const sizes: FileSize[] = [];

	for (const file of files) {
		const buffer = readFileSync(file);

		const plain = buffer.length;
		const gzip = getGzipSize(buffer);
		const brotli = getBrotliSize(buffer);

		sizes.push({ file, plain, gzip, brotli });
	}

	return sizes;
}

export function run(config: Config) {
	const sizes = getFileSizes(config.files);

	reportConsole(sizes);
}
