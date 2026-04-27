export type ElementId = string;

export interface BaseElement {
  id: ElementId;
  element: string;
  parentId: string;
  index: number;
}

export interface TextElement extends BaseElement {
  element: "text";
  value: string;
}

export interface LinkElement extends BaseElement {
  element: "link";
  value: string;
  src: string;
}

export interface ImageElement extends BaseElement {
  element: "image";
  value: string;
  alt?: string;
}

export interface ButtonElement extends BaseElement {
  element: "button";
  value: string;
  src: string;
}

export interface ContainerElement extends BaseElement {
  element: "container";
}

export type LandingElement = TextElement | LinkElement | ImageElement | ButtonElement | ContainerElement

export interface LandingPage {
  elements: LandingElement[];
}
