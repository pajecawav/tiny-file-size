import path from "path";
import { bold, dim, green } from "picocolors";
import { FileSize } from "./run";

export function buildJsonReport(sizes: FileSize[]): string {
	return JSON.stringify(sizes, undefined, 4);
}

export function buildPrettyReport(sizes: FileSize[]): string {
	const lines: string[] = [];

	const longestPath = Math.max(...sizes.map(size => size.file.length));
	const longestRawSize = Math.max(...sizes.map(size => humanizeBytes(size.raw).length));
	const longestGzipSize = Math.max(...sizes.map(size => humanizeBytes(size.gzip ?? 0).length));
	const longestBrotliSize = Math.max(
		...sizes.map(size => humanizeBytes(size.brotli ?? 0).length)
	);

	for (const { file, raw, gzip, brotli } of sizes) {
		const { dir, base } = path.parse(file);

		let line = "";

		const basePadding = longestPath - (dir ? dir.length + 1 : 0);
		const pathStr = (dir ? `${dim(dir)}/` : "") + `${green(base.padEnd(basePadding))}`;
		line += pathStr;

		line += " " + bold(humanizeBytes(raw).padStart(longestRawSize));

		if (gzip !== null) {
			const gzipStr = humanizeBytes(gzip).padStart(longestGzipSize);
			line += dim(` │ gzip: ${gzipStr}`);
		}

		if (brotli !== null) {
			const brotliStr = humanizeBytes(brotli).padStart(longestBrotliSize);
			line += dim(` │ brotli: ${brotliStr}`);
		}

		lines.push(line);
	}

	return lines.join("\n");
}

function humanizeBytes(bytes: number): string {
	let suffix = "MB";
	for (const suff of ["B", "KB"]) {
		if (bytes < 1024) {
			suffix = suff;
			break;
		}
		bytes /= 1024;
	}

	const precision = suffix === "B" ? 0 : 2;
	return `${bytes.toFixed(precision)} ${suffix}`;
}
