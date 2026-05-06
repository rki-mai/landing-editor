import type { LandingElement, LandingPage } from "../types";

export const updateElement = (
	page: LandingPage,
	updatedElement: LandingElement,
): LandingPage => {
	return {
		...page,
		elements: page.elements.map((el) =>
			el.id === updatedElement.id ? updatedElement : el,
		),
	};
};

// biome-ignore lint/suspicious/noExplicitAny: We need any here
export const landingPageUpdater = <Args extends any[]>(
	updater: (page: LandingPage, ...args: Args) => LandingPage,
) => {
	return (
		page: LandingPage | null,
		onUpdate: (updated: LandingPage) => void,
	) => {
		return (...args: Args) => {
			if (page === null) {
				console.warn("Unable to update not created page");
				return;
			}

			onUpdate(updater(page, ...args));
		};
	};
};
