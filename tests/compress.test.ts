import { describe, expect, it } from "vitest";
import { getBrotliSize, getGzipSize, getRawSize } from "../src/compress";
import { files } from "./fixtures/files";

describe("compress", () => {
	it("calculates raw size", async () => {
		const sizes = await Promise.all(files.map(file => getRawSize(file)));
		expect(sizes).toMatchSnapshot();
	});

	it("compresses with gzip", async () => {
		const sizes = await Promise.all(files.map(file => getGzipSize(file)));
		expect(sizes).toMatchSnapshot();
	});

	it("compresses with brotli", async () => {
		const sizes = await Promise.all(files.map(file => getBrotliSize(file)));
		expect(sizes).toMatchSnapshot();
	});
});
