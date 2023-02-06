import { existsSync, statSync } from "fs";
import { stat } from "fs/promises";
import { getBrotliSize, getGzipSize } from "./compress";
import { Config } from "./config";
import { logger } from "./logger";
import { reportConsole, reportJson } from "./report";

export interface FileSize {
	file: string;
	plain: number;
	gzip: number | null;
	brotli: number | null;
}

export async function getFileSizes(config: Config): Promise<FileSize[]> {
	const sizes: FileSize[] = await Promise.all(
		config.files.map(async file => {
			const [plain, gzip, brotli] = await Promise.all([
				stat(file).then(({ size }) => size),
				config.gzip ? getGzipSize(file) : null,
				config.brotli ? getBrotliSize(file) : null,
			]);

			return { file, plain, gzip, brotli };
		})
	);

	return sizes;
}

export async function run(config: Config) {
	for (const file of config.files) {
		if (!existsSync(file) || !statSync(file).isFile()) {
			logger.error(`No such file ${file}`);
			process.exit(1);
		}
	}

	let sizes: FileSize[];
	try {
		sizes = await getFileSizes(config);
	} catch (e: unknown) {
		if (!(e instanceof Error)) {
			throw e;
		}

		logger.error(e.message);
		process.exit(1);
	}

	if (config.output === "json") {
		reportJson(sizes);
	} else {
		reportConsole(sizes);
	}
}
