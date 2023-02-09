import colors from "picocolors";

export const logger = {
	error(message: string) {
		console.error(colors.bgRed(colors.bold(colors.black(" ERROR "))), colors.red(message));
	},
};
