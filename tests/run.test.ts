import { describe, expect, it } from "vitest";
import { getFileSizes } from "../src/run";
import { files } from "./fixtures/files";

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
