import binaryExtensions from "binary-extensions";
import { extname } from "path";

const binaryExtensionsSet = new Set(binaryExtensions);

export function sum(values: number[]): number {
	let total = 0;
	for (const value of values) total += value;
	return total;
}

export function isBinaryFile(path: string): boolean {
	return binaryExtensionsSet.has(extname(path).slice(1));
}
