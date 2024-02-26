import { statSync } from "fs";
import { globSync } from "glob";
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

export interface FileSizesOptions {
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
		}),
	);

	return sizes;
}

export function getFilesFromGlobs(globs: string[]): string[] {
	const filesSet = new Set<string>();

	for (const g of globs) {
		const isGlobADirectory = statSync(g, { throwIfNoEntry: false })?.isDirectory();
		const fullGlob = isGlobADirectory ? `${g}/**/*` : g;
		for (const file of globSync(fullGlob, { nodir: true })) {
			filesSet.add(file);
		}
	}

	return Array.from(filesSet);
}

export async function run(config: Config) {
	const files = getFilesFromGlobs(config.globs);

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
