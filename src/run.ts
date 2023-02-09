import { existsSync, statSync } from "fs";
import { globbySync, isDynamicPattern } from "globby";
import { getBrotliSize, getGzipSize, getRawSize } from "./compress";
import { Config } from "./config";
import { logger } from "./logger";
import { buildJsonReport, buildPrettyReport } from "./report";

export interface FileSize {
	file: string;
	raw: number;
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
			const [raw, gzip, brotli] = await Promise.all([
				getRawSize(file),
				config.gzip ? getGzipSize(file) : null,
				config.brotli ? getBrotliSize(file) : null,
			]);

			return { file, raw, gzip, brotli };
		})
	);

	return sizes;
}

export function getFilesFromGlobs(globs: string[]): string[] {
	const filesSet = new Set<string>();

	for (const globOrFile of globs) {
		// each
		if (isDynamicPattern(globOrFile)) {
			for (const file of globbySync(globOrFile)) {
				filesSet.add(file);
			}
		} else {
			if (!existsSync(globOrFile) || !statSync(globOrFile).isFile()) {
				throw new Error(`No such file ${globOrFile}`);
			}

			filesSet.add(globOrFile);
		}
	}

	return Array.from(filesSet);
}

export async function run(config: Config) {
	let files: string[];
	try {
		files = getFilesFromGlobs(config.files);
	} catch (e: unknown) {
		if (!(e instanceof Error)) {
			throw e;
		}

		logger.error(e.message);
		process.exit(1);
	}

	let sizes: FileSize[];
	try {
		sizes = await getFileSizes({ ...config, files });
	} catch (e: unknown) {
		if (!(e instanceof Error)) {
			throw e;
		}

		logger.error(e.message);
		process.exit(1);
	}

	let report: string;
	switch (config.output) {
		case "json":
			report = buildJsonReport(sizes);
			break;
		case "pretty":
			report = buildPrettyReport(sizes, { total: config.total });
			break;
	}

	console.log(report);
}
