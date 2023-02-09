import { describe, expect, it } from "vitest";
import { getFilesFromGlobs, getFileSizes } from "../src/run";
import { files, resolveDataFixture } from "./fixtures/files";

describe("getFileSizes", () => {
	it("counts raw sizes by default", async () => {
		const sizes = await getFileSizes({ files, gzip: false, brotli: false });
		expect(sizes).toMatchSnapshot();
	});

	it("counts gzip and brotli sizes", async () => {
		const sizes = await getFileSizes({ files, gzip: true, brotli: true });
		expect(sizes).toMatchSnapshot();
	});
});

describe("getFilesFromGlobs", () => {
	it("supports globs", async () => {
		const files = await getFilesFromGlobs([resolveDataFixture("*.{md,txt}")]);
		expect(files).toMatchSnapshot();
	});

	it("treats strings without dynamic patterns as paths", async () => {
		const files = await getFilesFromGlobs([
			resolveDataFixture("lorem.txt"),
			resolveDataFixture("*.md"),
		]);
		expect(files).toMatchSnapshot();
	});

	it("throws when file doesn't exist", async () => {
		const fn = () => {
			getFilesFromGlobs([resolveDataFixture("lorem.txt"), resolveDataFixture("doesntexist")]);
		};

		await expect(fn).toThrow(/no such file/i);
	});
});
