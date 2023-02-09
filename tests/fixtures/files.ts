import { readdirSync } from "fs";
import { relative, resolve } from "path";

const filenames = readdirSync(resolve(__dirname, "data"));

export const resolveDataFixture = (file: string) =>
	relative("./", resolve("./tests/fixtures/data", file));

export const files = filenames.map(resolveDataFixture);
