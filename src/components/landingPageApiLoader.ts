import type { ApiClient, Draft } from "./apiClient";
import { convertToLandingElement } from "./apiTypesConvertion";
import type { LandingPage } from "./types";

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
	return { elements: draft.elements.map(convertToLandingElement) };
};
