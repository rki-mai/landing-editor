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

export const normalizeIndexes = (page: LandingPage): LandingPage => {
	const newElements = page.elements.map((el) => ({ ...el }));
	const groupsByParent: Record<string, LandingElement[]> = {};

	for (const element of newElements) {
		if (!groupsByParent[element.parentId]) {
			groupsByParent[element.parentId] = [];
		}
		groupsByParent[element.parentId].push(element);
	}

	for (const parentId in groupsByParent) {
		const siblings = groupsByParent[parentId];
		siblings.sort((a, b) => a.index - b.index);
		siblings.forEach((element, newIndex) => {
			element.index = newIndex;
		});
	}

	return {
		...page,
		elements: newElements,
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
