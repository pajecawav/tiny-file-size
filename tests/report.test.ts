import { describe, expect, it } from "vitest";
import { FileSize } from "../src";
import { buildPrettyReport, buildJsonReport } from "../src/report";

const sizes: FileSize[] = [
	{ file: "foo.js", plain: 123456, gzip: 5661, brotli: 123 },
	{ file: "some/sub/path/bar.md", plain: 445123, gzip: 82734, brotli: 28372 },
	{ file: "another/folder/baz.js", plain: 1234, gzip: 5678, brotli: null },
	{ file: "simple.file.ts", plain: 1234, gzip: null, brotli: 5677 },
	{ file: "test/package.json", plain: 4444, gzip: null, brotli: null },
];

describe("report", () => {
	it("json", () => {
		const report = buildJsonReport(sizes);
		expect(report).toMatchSnapshot();
	});

	it("pretty", () => {
		const report = buildPrettyReport(sizes);
		expect(report).toMatchSnapshot();
	});
});
