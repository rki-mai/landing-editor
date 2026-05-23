import type { ApiClient, Operation } from "./apiClient";
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

const convertToDraftOperation = (action: Action): Operation => {
	if (action.type === "create") {
		const newElement = action.element;
		if (newElement.element == "text") {
			const styles: Record<string, string> = {};

			if (newElement.styles) {
				if (newElement.styles.fontSize)
					styles["fontSize"] = newElement.styles.fontSize.toString();
				if (newElement.styles.color) styles["color"] = newElement.styles.color;
			}

			return {
				operation: "create",
				data: {
					...newElement,
					styles: styles,
				},
			};
		}
	} else if (action.type === "update") {
		return {
			operation: "update",
			data: { id: action.id, fields: action.fields },
		};
	} else if (action.type === "delete") {
		return {
			operation: "delete",
			data: { id: action.id },
		};
	}

	throw new Error("Unsupported action " + JSON.stringify(action));
};
