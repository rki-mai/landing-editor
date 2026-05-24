import type { LandingElement } from "../types";
import { landingPageUpdater } from "./common";

type ElementFactory = (
	parentId: string,
	index: number,
	id: string,
) => LandingElement;

export const createElementHandler = landingPageUpdater(
	(page, elementFactory: ElementFactory) => {
		const rootElements = page.elements.filter((el) => el.parentId === "root");
		const rootElementAmount = rootElements.length;

		return {
			...page,
			elements: [
				...page.elements,
				elementFactory("root", rootElementAmount, `lb-${crypto.randomUUID()}`),
			],
		};
	},
);
