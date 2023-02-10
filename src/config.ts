import colors from "picocolors";
import { version } from "../package.json";
import { logger } from "./logger";

export interface Config {
	globs: string[];
	gzip: boolean;
	brotli: boolean;
	output: "json" | "pretty";
	total: boolean;
}

const HELP = `
${colors.bold("Usage:")}
  file-size [options] [globs...]

${colors.bold("Options:")}
  -h, --help                     Show help
  -g, --gzip                     Include gzip size in output 
  -b, --brotli                   Include brotli size in output 
      --total                    Include total size in output
      --json                     Print result as json
  -v, --version                  Print the current version and exit

${colors.bold("Examples:")}
  # Show sizes of files foo.js and bar.json
  file-size foo.js bar.json

  # Include sizes after gzip and brotli
  file-size --gzip --brotli foo.js bar.json

  # Print output as JSON
  file-size --json foo.js bar.json
`.trim();

export function parseArgs(args: string[]): Config {
	const cfg: Config = {
		globs: [],
		gzip: false,
		brotli: false,
		output: "pretty",
		total: false,
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (arg[0] !== "-") {
			cfg.globs = args.slice(i);
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
			case "-g":
			case "--gzip":
				cfg.gzip = true;
				break;
			case "-b":
			case "--brotli":
				cfg.brotli = true;
				break;
			case "--json":
				cfg.output = "json";
				break;
			case "--total":
				cfg.total = true;
				break;
			default:
				logger.error(`Unknown argument ${arg}`);
				process.exit(1);
		}
	}

	return cfg;
}

export const config = parseArgs(process.argv.slice(2));
