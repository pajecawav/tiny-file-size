export default {
	"*.{js,jsx,mjs,ts,tsx,cjs,cts,json,md,yml,css}": "prettier --write",
	"src/**/*.{js,jsx,ts,tsx}": [() => "pnpm lint:tsc", "eslint"],
};
