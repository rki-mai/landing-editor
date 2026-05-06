import type { LandingElement } from "../types";
import { landingPageUpdater } from "./common";

export const landingElementUpdater = landingPageUpdater(
	(page, updatedElement: LandingElement) => {
		return {
			...page,
			elements: page.elements.map((el) =>
				el.id === updatedElement.id ? updatedElement : el,
			),
		};
	},
);
