import type { LandingPage } from "./types";

export const getElementById = (page: LandingPage, id: string) => {
	for (const element of page.elements) {
		if (element.id === id) {
			return element;
		}
	}
	return null;
};

export const findElementById = (page: LandingPage, id: string) => {
	const maybeElement = getElementById(page, id);
	if (!maybeElement) {
		throw new Error(`Element with ID '${id}' not found`);
	}
	return maybeElement;
};
