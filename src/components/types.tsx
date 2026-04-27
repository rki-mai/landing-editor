export type ElementId = string;
export type Color = string;

export interface BaseElement {
  id: ElementId;
  element: string;
  parentId: string;
  index: number;
}

export interface TextElementStyles {
  color?: Color;
  fontSize?: number;
}

export interface TextElement extends BaseElement {
  element: "text";
  value: string;
  styles?: TextElementStyles;
}

export interface LinkElementStyles {
  textDecoration?: "underline" | "none";
}

export interface LinkElement extends BaseElement {
  element: "link";
  value: string;
  src: string;
  styles?: LinkElementStyles;
}

export interface ImageElementStyles {
  width?: number;
  position?: "left" | "center" | "right";
}

export interface ImageElement extends BaseElement {
  element: "image";
  value: string;
  alt?: string;
  styles?: ImageElementStyles;
}

export interface ButtonElementStyles {
  backgroundColor?: Color;
  color?: Color;
}

export interface ButtonElement extends BaseElement {
  element: "button";
  value: string;
  src: string;
  styles?: ButtonElementStyles;
}

export interface ContainerElement extends BaseElement {
  element: "container";
}

export type LandingElement = TextElement | LinkElement | ImageElement | ButtonElement | ContainerElement

export interface LandingPage {
  elements: LandingElement[];
}
