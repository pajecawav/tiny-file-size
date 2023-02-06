import { existsSync, statSync } from "fs";
import { getBrotliSize, getGzipSize, getPlainSize } from "./compress";
import { Config } from "./config";
import { logger } from "./logger";
import { buildPrettyReport, buildJsonReport } from "./report";

export interface FileSize {
	file: string;
	plain: number;
	gzip: number | null;
	brotli: number | null;
}

interface FileSizesOptions {
	files: string[];
	gzip: boolean;
	brotli: boolean;
}

export async function getFileSizes(config: FileSizesOptions): Promise<FileSize[]> {
	const sizes: FileSize[] = await Promise.all(
		config.files.map(async file => {
			const [plain, gzip, brotli] = await Promise.all([
				getPlainSize(file),
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
		console.log(buildJsonReport(sizes));
	} else {
		console.log(buildPrettyReport(sizes));
	}
}
