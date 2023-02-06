import { bold } from "picocolors";
import { version } from "../package.json";
import { logger } from "./logger";

export interface Config {
	files: string[];
	gzip: boolean;
	brotli: boolean;
	output: "json" | "pretty";
}

const HELP = `
${bold("Usage:")}
  file-size [options] [files...]

${bold("Options:")}
  -h, --help                     Show help
      --gzip                     Include gzip size in output 
      --brotli                   Include brotli size in output 
      --json                     Print result as json
  -v, --version                  Print the current version (${version}) and exit

${bold("Examples:")}
  # Show sizes of files foo.js and bar.json
  file-size foo.js bar.json

  # Include sizes after gzip and brotli
  file-size --gzip --brotli foo.js bar.json

  # Print output as JSON
  file-size --json foo.js bar.json
`.trim();

function parseArgs(): Config {
	let files: string[] = [];
	let gzip = false;
	let brotli = false;
	let output: Config["output"] = "pretty";

	for (let i = 2; i < process.argv.length; i++) {
		const arg = process.argv[i];

		if (arg[0] !== "-") {
			files = process.argv.slice(i);
			break;
		}

		switch (arg) {
			case "-h":
			case "--help":
				console.log(HELP);
				process.exit(0);
				break;
			case "-v":
			case "--version":
				console.log(version);
				process.exit(0);
				break;
			case "--gzip":
				gzip = true;
				break;
			case "--brotli":
				brotli = true;
				break;
			case "--json":
				output = "json";
				break;
			default:
				logger.error(`Unknown argument ${arg}`);
				process.exit(1);
		}
	}

	return { files, gzip, brotli, output };
}

export const config = parseArgs();
