import type { ApiClient, Operation } from "./apiClient";
import { convertToDraftOperation } from "./apiTypesConvertion";
import { debounceCall } from "./debounceCall";
import { type Action, calculateDiff } from "./landing_diff";
import type { LandingPage } from "./types";

const CHECK_INTERVAL = 100;
const RETRY_INTERVAL = 5000;
const DEBOUNCE_DELAY = 400;

const actionQueue: Action[] = [];
let lastLandingPageState: LandingPage | null = null;

export const updateLandingPage = debounceCall((page: LandingPage) => {
	if (lastLandingPageState === null) {
		console.warn(
			"Unable to update landing page: last landing page state is null",
		);
		return;
	}

	console.log("[DraftUpdater] Source landling page: ", lastLandingPageState);
	console.log("[DraftUpdater] Source landling page: ", page);

	for (const action of calculateDiff(lastLandingPageState, page)) {
		console.log("[DraftUpdater] Enqueuing action: ", action);
		actionQueue.push(action);
	}

	lastLandingPageState = page;
}, DEBOUNCE_DELAY);

export const run = async (
	client: ApiClient,
	projectId: string,
	initialState: LandingPage,
) => {
	console.log("[DraftUpdater] Starting...");
	lastLandingPageState = initialState;

	while (true) {
		const action = await getOperation();
		const operation = convertToDraftOperation(action);
		await processOperation(client, projectId, operation);
	}
};

const processOperation = async (
	client: ApiClient,
	projectId: string,
	operation: Operation,
) => {
	while (true) {
		try {
			console.log("[DraftUpdater] Processing operation:", operation);
			await client.updateDraft(projectId, operation);
			console.log("[DraftUpdater] Operation processed");
			break;
		} catch (error) {
			console.error("[DraftUpdater] Error processing operation:", error);
			await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
		}
	}
};

const getOperation = async () => {
	while (actionQueue.length === 0) {
		await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
	}

	return actionQueue.shift()!;
};
