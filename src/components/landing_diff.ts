import type { LandingElement, LandingPage } from "./types";
import { getElementById } from "./utils";

interface UpdateObject extends Record<string, UpdateValue> {}
type UpdateValue = string | number | boolean | UpdateObject;

type CreateElementAction = {
	type: "create";
	element: LandingElement;
};

type UpdateElementAction = {
	type: "update";
	id: string;
	fields: Record<string, UpdateValue>;
};

type DeleteElementAction = {
	type: "delete";
	id: string;
};

export type Action =
	| CreateElementAction
	| UpdateElementAction
	| DeleteElementAction;

const getElementIds = (page: LandingPage) => {
	return page.elements.map((element) => element.id);
};

export const calculateDiff = (source: LandingPage, updated: LandingPage) => {
	const allKeys = new Set([
		...getElementIds(source),
		...getElementIds(updated),
	]);
	const actions: Action[] = [];

	allKeys.forEach((key) => {
		const sourceElement = getElementById(source, key);
		const updatedElement = getElementById(updated, key);

		if (!sourceElement && updatedElement) {
			actions.push({ type: "create", element: updatedElement });
		} else if (sourceElement && !updatedElement) {
			actions.push({ type: "delete", id: sourceElement.id });
		} else if (sourceElement && updatedElement) {
			const sourceElementFields: UpdateObject = sourceElement;
			const updatedElementFields: UpdateObject = updatedElement;
			const fieldsToUpdate: UpdateObject = {};

			Object.keys(updatedElementFields).forEach((field) => {
				if (sourceElementFields[field] !== updatedElementFields[field]) {
					fieldsToUpdate[field] = updatedElementFields[field];
				}
			});

			if (Object.keys(fieldsToUpdate).length > 0) {
				actions.push({
					type: "update",
					id: sourceElement.id,
					fields: fieldsToUpdate,
				});
			}
		}
	});

	return actions;
};
