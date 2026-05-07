import type { TextElement } from "./types";

export const createTextElement = (
	parentId: string,
	index: number,
	id: string,
): TextElement => {
	return {
		element: "text",
		id: id,
		parentId: parentId,
		index: index,
		value: "Example",
		styles: {
			color: "#000000",
			fontSize: 12,
		},
	};
};
