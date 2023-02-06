import { readFile } from "fs/promises";
import { getBrotliSize, getGzipSize } from "./compress";
import { Config } from "./config";
import { reportConsole } from "./report";

export interface FileSize {
	file: string;
	plain: number;
	gzip: number;
	brotli: number;
}

export async function getFileSizes(files: string[]): Promise<FileSize[]> {
	const sizes: FileSize[] = await Promise.all(
		files.map(async file => {
			const buffer = await readFile(file);

			const plain = buffer.length;
			const [gzip, brotli] = await Promise.all([getGzipSize(buffer), getBrotliSize(buffer)]);

			return { file, plain, gzip, brotli };
		})
	);

	return sizes;
}

export async function run(config: Config) {
	const sizes = await getFileSizes(config.files);

	reportConsole(sizes);
}
