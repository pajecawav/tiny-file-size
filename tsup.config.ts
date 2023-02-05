import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/cli.ts"],
	outDir: "dist",
	format: ["esm", "cjs"],
	clean: true,
	dts: true,
});
