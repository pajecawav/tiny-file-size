import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/config";

describe("config", () => {
	it("parses list of files", () => {
		const config = parseArgs(["foo.txt", "foo.md", "bar.json"]);
		expect(config.files).toStrictEqual(["foo.txt", "foo.md", "bar.json"]);
	});

	it("treats all arguments after first non-option as a list of files", () => {
		const config = parseArgs(["--gzip", "foo.txt", "--json", "bar.json"]);
		expect(config.files).toStrictEqual(["foo.txt", "--json", "bar.json"]);
		expect(config.output).toBe("pretty");
	});

	it("parses arguments to enable gzip and brotli", () => {
		const config = parseArgs(["--gzip", "--brotli", "bar.json"]);
		expect(config.gzip).toBe(true);
		expect(config.brotli).toBe(true);
	});

	it("defaults to pretty output", () => {
		const config = parseArgs(["foo.txt", "foo.md", "bar.json"]);
		expect(config.output).toBe("pretty");
	});

	it("parses argument for outputting json", () => {
		const config = parseArgs(["--json", "foo.txt"]);
		expect(config.output).toBe("json");
	});
});
