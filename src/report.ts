import path from "path";
import { bold, dim, green } from "picocolors";
import { FileSize } from "./run";

export function reportJson(sizes: FileSize[]) {
	console.log(sizes);
}

export function reportConsole(sizes: FileSize[]) {
	for (const { file, plain, gzip, brotli } of sizes) {
		const { dir, base } = path.parse(file);

		const pathStr = (dir ? dim(dir + "/") : "") + green(base);

		const plainStr = humanizeBytes(plain);
		const gzipStr = humanizeBytes(gzip);
		const brotliStr = humanizeBytes(brotli);

		console.log(`${pathStr}: ${bold(plainStr)} (${gzipStr} gzip, ${brotliStr} brotli)`);
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

	if (suffix === "B") {
		return `${bytes.toFixed(0)} ${suffix}`;
	}

	return `${bytes.toFixed(2)} ${suffix}`;
}
