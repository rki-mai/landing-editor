import { z } from "zod";
import type { DraftElement, Operation } from "./apiClient";
import type { Action } from "./landing_diff";
import type {
	ButtonElementStyles,
	ImageElementStyles,
	LandingElement,
	LinkElementStyles,
	TextElementStyles,
} from "./types";

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
	if (styles.bold) textStyles.bold = convertToBoolean(styles.bold);
	if (styles.italic) textStyles.italic = convertToBoolean(styles.italic);
	if (styles.underline)
		textStyles.underline = convertToBoolean(styles.underline);
	if (styles.textAlign) {
		const processed = convertToLiteral(styles.textAlign, [
			"left",
			"center",
			"right",
		]);
		textStyles.textAlign = processed;
	}
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
	styles: Record<string, string | number | boolean>,
): DraftStyles => {
	const draftStyles: DraftStyles = {};
	for (const [key, value] of Object.entries(styles)) {
		draftStyles[key] = value.toString();
	}
	return draftStyles;
};

const convertToBoolean = (value: string) => {
	switch (value) {
		case "true":
			return true;
		case "false":
			return false;
		default:
			throw new Error(`Can't parse value '${value}' to boolean`);
	}
};

const convertToLiteral = <T extends string>(value: string, literals: T[]) => {
	for (const literal of literals) {
		if (value === literal) {
			return literal;
		}
	}

	throw new Error(`Unexpected value '${value}'. Expected one of ${literals}`);
};
