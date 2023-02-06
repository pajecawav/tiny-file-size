import { logger } from "./logger";

export interface Config {
	files: string[];
	gzip: boolean;
	brotli: boolean;
}

function parseArgs(): Config {
	let files: string[] = [];
	let gzip = false;
	let brotli = false;

	for (let i = 2; i < process.argv.length; i++) {
		const arg = process.argv[i];

		if (arg[0] !== "-") {
			files = process.argv.slice(i);
			break;
		}

		switch (arg) {
			case "--gzip":
				gzip = true;
				break;
			case "--brotli":
				brotli = true;
				break;
			default:
				logger.error(`Unknown argument ${arg}`);
				process.exit(1);
		}
	}

	return { files, gzip, brotli };
}

export const config = parseArgs();
