import type { LandingElement } from "../types";
import { landingPageUpdater, normalizeIndexes } from "./common";

function getAllChildrenIds(
	elements: LandingElement[],
	parentId: string,
): Set<string> {
	const ids = new Set<string>();
	ids.add(parentId);

	for (const el of elements) {
		if (el.parentId === parentId) {
			const childIds = getAllChildrenIds(elements, el.id);
			childIds.forEach((id) => ids.add(id));
		}
	}

	return ids;
}

export const deleteElementHandler = landingPageUpdater(
	(page, element: LandingElement) => {
		const idsToDelete = getAllChildrenIds(page.elements, element.id);
		const pageAfterDelete = {
			...page,
			elements: page.elements.filter((el) => !idsToDelete.has(el.id)),
		};
		return normalizeIndexes(pageAfterDelete);
	},
);
