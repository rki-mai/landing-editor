import type { ApiClient, Operation } from "./apiClient";
import { convertToDraftOperation } from "./apiTypesConvertion";
import type { Action } from "./landing_diff";

const actionQueue: Action[] = [];
const CHECK_INTERVAL = 100;
const RETRY_INTERVAL = 5000;

export const enqueueAction = (action: Action) => {
	actionQueue.push(action);
};

export const run = async (client: ApiClient, projectId: string) => {
	console.log("[DraftUpdater] Starting...");

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
