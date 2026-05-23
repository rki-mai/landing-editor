import type { DraftElement, Operation } from "./apiClient";
import { z } from "zod";
import type {
	ButtonElementStyles,
	ImageElementStyles,
	LandingElement,
	LinkElementStyles,
	TextElementStyles,
} from "./types";
import type { Action } from "./landing_diff";

type DraftStyles = Record<string, string>;

const PositionSchema = z.union([
	z.literal("left"),
	z.literal("center"),
	z.literal("right"),
]);

const TextDecorationSchema = z.union([
	z.literal("none"),
	z.literal("underline"),
]);

export const convertToDraftElement = (
	element: LandingElement,
): DraftElement => {
	if (element.element === "container") {
		return element;
	}

	const draftStyles = element.styles
		? convertToDraftStyles(element.styles)
		: {};

	return { ...element, styles: draftStyles };
};

export const convertToLandingElement = (
	element: DraftElement,
): LandingElement => {
	switch (element.element) {
		case "text":
			return {
				...element,
				styles: convertToTextStyles(element.styles || {}),
			};
		case "link":
			return {
				...element,
				styles: convertToLinkStyles(element.styles || {}),
			};
		case "image":
			return {
				...element,
				styles: convertToImageStyles(element.styles || {}),
			};
		case "button":
			return {
				...element,
				styles: convertToButtonStyles(element.styles || {}),
			};
		case "container":
			return element;
	}
};

export const convertToDraftOperation = (action: Action): Operation => {
	switch (action.type) {
		case "create":
			return {
				operation: "create",
				data: convertToDraftElement(action.element),
			};
		case "update":
			return {
				operation: "update",
				data: {
					id: action.id,
					fields: action.fields.styles
						? {
								...action.fields,
								styles: convertToDraftStyles(
									action.fields.styles as Record<string, string | number>,
								),
							}
						: action.fields,
				},
			};
		case "delete":
			return {
				operation: "delete",
				data: { id: action.id },
			};
	}
};

const convertToTextStyles = (styles: DraftStyles): TextElementStyles => {
	const textStyles: TextElementStyles = {};
	if (styles.color) textStyles.color = styles.color;
	if (styles.fontSize) textStyles.fontSize = parseInt(styles.fontSize, 10);
	return textStyles;
};

const convertToImageStyles = (styles: DraftStyles): ImageElementStyles => {
	const imageStyles: ImageElementStyles = {};
	if (styles.width) imageStyles.width = parseInt(styles.width, 10);
	if (styles.position)
		imageStyles.position = PositionSchema.parse(styles.position.toLowerCase());
	return imageStyles;
};

const convertToLinkStyles = (styles: DraftStyles): LinkElementStyles => {
	const linkStyles: LinkElementStyles = {};
	if (styles.textDecoration)
		linkStyles.textDecoration = TextDecorationSchema.parse(
			styles.textDecoration,
		);
	return linkStyles;
};

const convertToButtonStyles = (styles: DraftStyles): ButtonElementStyles => {
	const buttonStyles: ButtonElementStyles = {};
	if (styles.backgroundColor)
		buttonStyles.backgroundColor = styles.backgroundColor;
	if (styles.color) buttonStyles.color = styles.color;
	return buttonStyles;
};

const convertToDraftStyles = (
	styles: Record<string, string | number>,
): DraftStyles => {
	const draftStyles: DraftStyles = {};
	for (const [key, value] of Object.entries(styles)) {
		draftStyles[key] = value.toString();
	}
	return draftStyles;
};
