import type {
	ButtonElement,
	ContainerElement,
	ImageElement,
	LinkElement,
	TextElement,
} from "./types";

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

export const createImageElement = (
	parentId: string,
	index: number,
	id: string,
): ImageElement => {
	return {
		element: "image",
		id: id,
		parentId: parentId,
		index: index,
		value:
			"https://cdn-user30887.skyeng.ru/uploads/67695996d92d0258406240.webp",
		styles: {
			width: 100,
			position: "center",
		},
	};
};

export const createLinkElement = (
	parentId: string,
	index: number,
	id: string,
): LinkElement => {
	return {
		element: "link",
		id: id,
		parentId: parentId,
		index: index,
		value: "Link",
		src: "https://example.com/",
		styles: {
			textDecoration: "underline",
		},
	};
};

export const createButtonElement = (
	parentId: string,
	index: number,
	id: string,
): ButtonElement => {
	return {
		element: "button",
		id: id,
		parentId: parentId,
		index: index,
		value: "Button",
		src: "https://example.com/",
		styles: {
			backgroundColor: "#2196f3",
			color: "#ffffff",
		},
	};
};

export const createContainerElement = (
	parentId: string,
	index: number,
	id: string,
): ContainerElement => {
	return {
		element: "container",
		id: id,
		parentId: parentId,
		index: index,
	};
};
