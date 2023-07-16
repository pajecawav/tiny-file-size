import path from "path";
import colors from "picocolors";
import { FileSize } from "./run";
import { sum } from "./utils";

export function buildJsonReport(sizes: FileSize[]): string {
	return JSON.stringify(sizes, undefined, 4);
}

export interface PrettyReportOptions {
	total?: boolean;
}

export function buildPrettyReport(
	sizes: FileSize[],
	{ total = false }: PrettyReportOptions = {},
): string {
	const lines: string[] = [];

	const longestPath = Math.max(...sizes.map(size => size.file.length));
	const longestRawSize = Math.max(...sizes.map(size => humanizeBytes(size.raw).length));
	const longestGzipSize = Math.max(...sizes.map(size => humanizeBytes(size.gzip ?? 0).length));
	const longestBrotliSize = Math.max(
		...sizes.map(size => humanizeBytes(size.brotli ?? 0).length),
	);

	function formatSize(size: number): string {
		return colors.bold(humanizeBytes(size).padStart(longestRawSize));
	}

	function formatGzip(size: number): string {
		const str = humanizeBytes(size).padStart(longestGzipSize);
		return colors.dim(` │ gzip: ${str}`);
	}

	function formatBrotli(size: number): string {
		const str = humanizeBytes(size).padStart(longestBrotliSize);
		return colors.dim(` │ brotli: ${str}`);
	}

	for (const { file, raw, gzip, brotli } of sizes) {
		const { dir, base } = path.parse(file);

		let line = "";

		const basePadding = longestPath - (dir ? dir.length + 1 : 0);
		line += (dir ? `${colors.dim(dir)}/` : "") + `${colors.green(base.padEnd(basePadding))}`;

		line += " " + formatSize(raw);

		if (gzip !== null) {
			line += formatGzip(gzip);
		}

		if (brotli !== null) {
			line += formatBrotli(brotli);
		}

		lines.push(line);
	}

	if (total) {
		const totalSize = sum(sizes.map(size => size.raw));
		const totalGzipSize = sum(sizes.map(size => size.gzip ?? 0));
		const totalBrotliSize = sum(sizes.map(size => size.brotli ?? 0));

		let line = "";

		line += colors.bold("Total:".padEnd(longestPath));

		line += " " + formatSize(totalSize);

		if (totalGzipSize) {
			line += formatGzip(totalGzipSize);
		}

		if (totalBrotliSize) {
			line += formatBrotli(totalBrotliSize);
		}

		lines.push(line);
	}

	return lines.join("\n");
}

export function humanizeBytes(bytes: number): string {
	let suffix = "MB";
	for (const suff of [" B", "KB"]) {
		if (bytes < 1024) {
			suffix = suff;
			break;
		}
		bytes /= 1024;
	}

	const precision = suffix === "B" ? 0 : 2;
	return `${bytes.toFixed(precision)} ${suffix}`;
}
