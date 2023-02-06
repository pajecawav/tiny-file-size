import path from "path";
import { bold, dim, green } from "picocolors";
import { FileSize } from "./run";

export function reportJson(sizes: FileSize[]) {
	console.log(sizes);
}

export function reportConsole(sizes: FileSize[]) {
	const longestPath = Math.max(...sizes.map(size => size.file.length));
	const longestPlainSize = Math.max(...sizes.map(size => humanizeBytes(size.plain).length));
	const longestGzipSize = Math.max(...sizes.map(size => humanizeBytes(size.gzip).length));
	const longestBrotliSize = Math.max(...sizes.map(size => humanizeBytes(size.brotli).length));

	for (const { file, plain, gzip, brotli } of sizes) {
		const { dir, base } = path.parse(file);

		const basePadding = longestPath - (dir ? dir.length + 1 : 0);
		const pathStr = (dir ? `${dim(dir)}/` : "") + `${green(base.padEnd(basePadding))}`;

		const plainStr = humanizeBytes(plain).padStart(longestPlainSize);
		const gzipStr = humanizeBytes(gzip).padStart(longestGzipSize);
		const brotliStr = humanizeBytes(brotli).padStart(longestBrotliSize);

		console.log(
			`${pathStr} ${bold(plainStr)}`,
			dim(`│ gzip: ${gzipStr}`),
			dim(`│ brotli: ${brotliStr}`)
		);
	}
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
