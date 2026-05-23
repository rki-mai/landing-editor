import type { ApiClient, Draft, DraftElement } from "./apiClient";
import type { LandingElement, LandingPage, TextElementStyles } from "./types";

export const loadPageFromApi = async (
	apiClient: ApiClient,
	projectId: string,
): Promise<LandingPage> => {
	console.log(`Fetching draft '${projectId}'...`);
	const draft = await apiClient.getDraft(projectId);
	console.log(`Fetching draft '${projectId}'... ok`);
	return convertToLandingPage(draft);
};

const convertToLandingPage = (draft: Draft): LandingPage => {
	return { elements: draft.map(convertToLandingElement) };
};

const convertToLandingElement = (
	draftElement: DraftElement,
): LandingElement => {
	if (draftElement.element === "text") {
		const elementStyles: TextElementStyles = {};
		if (draftElement.styles) {
			if (draftElement.styles.fontSize)
				elementStyles.fontSize = parseInt(draftElement.styles.fontSize);

			if (draftElement.styles.color)
				elementStyles.color = draftElement.styles.color;
		}

		return {
			element: "text",
			id: draftElement.id,
			parentId: draftElement.parentId,
			index: draftElement.index,
			value: draftElement.value,
			styles: elementStyles,
		};
	}

	throw new Error("Unsupported element type: " + draftElement.element);
};
