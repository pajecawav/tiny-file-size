// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
	{
		ignores: ["**/dist", "**/coverage"],
	},
	{
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.node,
		},
		extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
	},
);
