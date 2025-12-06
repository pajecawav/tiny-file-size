import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
		},
		env: {
			FORCE_COLOR: "1",
		},
	},
});
