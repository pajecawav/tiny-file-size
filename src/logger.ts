import { bgRed, black, bold, red } from "picocolors";

export const logger = {
	error(message: string) {
		console.log(bgRed(bold(black(" ERROR "))), red(message));
	},
};
