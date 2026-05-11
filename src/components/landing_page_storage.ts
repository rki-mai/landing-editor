import { type LandingPage } from "./types";

const STORAGE_KEY = "landingPageState";
const DEFAULT_PAGE: LandingPage = { elements: [] };

export function getInitialLandingPage(): LandingPage {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error("Failed to load landing page from localStorage:", error);
	}
	return DEFAULT_PAGE;
}

export function saveLandingPage(landingPage: LandingPage): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(landingPage));
	} catch (error) {
		console.error("Failed to save landing page to localStorage:", error);
	}
}
