import { readdirSync } from "fs";
import { relative, resolve } from "path";

const filenames = readdirSync(resolve(__dirname, "data"));
export const files = filenames.map(file => relative("./", resolve("./tests/fixtures/data", file)));
