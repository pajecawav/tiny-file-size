import { describe, expect, it } from "vitest";
import { getBrotliSize, getGzipSize, getPlainSize } from "../src/compress";
import { files } from "./fixtures/files";

describe("compress", () => {
	it("calculates plain size", async () => {
		const sizes = await Promise.all(files.map(file => getPlainSize(file)));
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
