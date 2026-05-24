// biome-ignore lint/suspicious/noExplicitAny: we need any here to make the debounce function generic
export const debounceCall = <Args extends any[]>(
	fn: (...args: Args) => void,
	delay: number,
) => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Args) => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			timeoutId = null;
			fn(...args);
		}, delay);
	};
};
