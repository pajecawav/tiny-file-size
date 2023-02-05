export interface Config {
	files: string[];
}

const files = process.argv.slice(2);

export const config: Config = { files };
