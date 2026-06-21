export type ElementId = string;
export type Color = string;

export type BaseElement = {
	id: ElementId;
	element: string;
	parentId: string;
	index: number;
};

export type TextElementStyles = {
	color?: Color;
	fontSize?: number;
	format?: "h1" | "h2" | "h3" | "paragraph";
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
};

export type TextElement = BaseElement & {
	element: "text";
	value: string;
	styles?: TextElementStyles;
};

export type LinkElementStyles = {
	textDecoration?: "underline" | "none";
};

export type LinkElement = BaseElement & {
	element: "link";
	value: string;
	src: string;
	styles?: LinkElementStyles;
};

export type ImageElementStyles = {
	width?: number;
	position?: "left" | "center" | "right";
};

export type ImageElement = BaseElement & {
	element: "image";
	value: string;
	alt?: string;
	styles?: ImageElementStyles;
};

export type ButtonElementStyles = {
	backgroundColor?: Color;
	color?: Color;
};

export type ButtonElement = BaseElement & {
	element: "button";
	value: string;
	src: string;
	styles?: ButtonElementStyles;
};

export type ContainerElement = BaseElement & {
	element: "container";
};

export type LandingElement =
	| TextElement
	| LinkElement
	| ImageElement
	| ButtonElement
	| ContainerElement;

export type LandingPage = {
	elements: LandingElement[];
	version: number;
};
