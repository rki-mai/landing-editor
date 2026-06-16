import type {
	Publication as ApiPublication,
	PublicationStatus,
} from "./apiClient";
import { type ApiClient, TokenProviderError, Unauthorized } from "./apiClient";
import { runBackgroundTask } from "./backgroundTask";

export interface Publication {
	id: string;
	projectId: string;
	projectName: string;
	creationDate: Date;
	link?: string;
	status: PublicationStatus;
}

export const runPublicationPoller = (
	apiClient: ApiClient,
	onPublicationUpdated: (publications: Publication[]) => void,
	interval: number,
) => {
	runBackgroundTask("publicationPoller", async () => {
		try {
			while (true) {
				const publications = await getPublications(apiClient);
				onPublicationUpdated(publications);
				await sleep(interval);
			}
		} catch (err) {
			if (err instanceof Unauthorized || err instanceof TokenProviderError) {
				window.location.href = "/login";
			}
		}
	});
};

const getPublications = async (apiClient: ApiClient) => {
	console.log("[PublicationPoller] Getting publications ...");
	const projects = await apiClient.getProjects();
	const publications: Publication[] = [];
	for (const project of projects.projects) {
		const publicationIds = await apiClient.getPublicationIds(project.id);
		for (const publicationId of publicationIds) {
			const publication = await apiClient.getPublication(
				project.id,
				publicationId,
			);

			publications.push(
				convertPublication(project.id, publicationId, publication),
			);
		}
	}

	return publications;
};

const convertPublication = (
	projectId: string,
	publicationId: string,
	publication: ApiPublication,
): Publication => {
	const parsedPublication: Publication = {
		id: publicationId,
		projectId: projectId,
		projectName: "Project",
		creationDate: new Date(publication.created_at),
		status: publication.status,
	};

	if (publication.public_url) {
		parsedPublication.link = publication.public_url;
	}

	return parsedPublication;
};

const sleep = async (ms: number) => {
	const promise = new Promise((resolve) => setTimeout(resolve, ms));
	await promise;
};
