import type { LandingElement, LandingPage } from "../types";
import { landingPageUpdater, updateElement } from "./common";

type Direction = "up" | "down";

interface ElementPosition {
	parentId: string;
	index: number;
}

const findElementById = (
	page: LandingPage,
	elementId: string,
): LandingElement => {
	for (const element of page.elements) {
		if (element.id === elementId) {
			return element;
		}
	}

	throw new Error(`Element with ID '${elementId}' not found`);
};

const getNeighborElements = (
	element: LandingElement,
	elements: LandingElement[],
): {
	prevElement: LandingElement | null;
	nextElement: LandingElement | null;
} => {
	const processed = elements
		.filter((el) => el.parentId === element.parentId && el.id !== element.id)
		.sort((a, b) => a.index - b.index);

	const prevIndex = processed.findLastIndex((el) => el.index <= element.index);
	const nextIndex = processed.findIndex((el) => el.index >= element.index);

	return {
		prevElement: prevIndex !== -1 ? processed[prevIndex] : null,
		nextElement: nextIndex !== -1 ? processed[nextIndex] : null,
	};
};

const getUpdatedPosition = (
	element: LandingElement,
	page: LandingPage,
	direction: Direction,
): ElementPosition => {
	const { prevElement, nextElement } = getNeighborElements(
		element,
		page.elements,
	);

	if (direction === "up" && prevElement === null) {
		const parentElement = findElementById(page, element.parentId);
		return {
			parentId: parentElement.parentId,
			index: parentElement.index - 0.5,
		};
	} else if (direction === "down" && nextElement === null) {
		const parentElement = findElementById(page, element.parentId);
		return {
			parentId: parentElement.parentId,
			index: parentElement.index + 0.5,
		};
	} else if (direction === "down" && nextElement?.element === "container") {
		return {
			parentId: nextElement.id,
			index: -1,
		};
	} else if (direction === "up" && prevElement?.element === "container") {
		return {
			parentId: prevElement.id,
			index: Infinity,
		};
	} else {
		const delta = direction === "up" ? -1.5 : 1.5;
		return { parentId: element.parentId, index: element.index + delta };
	}
};

const normalizeIndexes = (page: LandingPage): LandingPage => {
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

export const moveElementHandler = landingPageUpdater(
	(page, element: LandingElement, direction: Direction) => {
		return normalizeIndexes(
			updateElement(page, {
				...element,
				...getUpdatedPosition(element, page, direction),
			}),
		);
	},
);
