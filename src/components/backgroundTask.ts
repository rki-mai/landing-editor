const executionCache = new Set<string>();

const runTask = async (key: string, task: () => Promise<void>) => {
	console.log("[BackgroundTask] Running task with key:", key);

	try {
		await task();
		console.log(
			`[BackgroundTask] Task with key '${key}' completed successfully.`,
		);
	} catch (error) {
		console.error(`[BackgroundTask] Error in task with key '${key}':`, error);
	}
};

export const runBackgroundTask = (key: string, task: () => Promise<void>) => {
	if (!executionCache.has(key)) {
		runTask(key, task);
		executionCache.add(key);
	}
};
