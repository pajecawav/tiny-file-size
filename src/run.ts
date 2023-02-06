import { stat } from "fs/promises";
import { getBrotliSize, getGzipSize } from "./compress";
import { Config } from "./config";
import { logger } from "./logger";
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
			const [plain, gzip, brotli] = await Promise.all([
				stat(file).then(({ size }) => size),
				getGzipSize(file),
				getBrotliSize(file),
			]);

			return { file, plain, gzip, brotli };
		})
	);

	return sizes;
}

export async function run(config: Config) {
	let sizes: FileSize[];
	try {
		sizes = await getFileSizes(config.files);
	} catch (e: unknown) {
		if (!(e instanceof Error)) {
			throw e;
		}

		logger.error(e.message);
		process.exit(1);
	}

	reportConsole(sizes);
}
