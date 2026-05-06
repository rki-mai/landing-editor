import { useState } from "react";
import { renderElements } from "./components/editor_components_renderer";
import { JsonEditor } from "./components/json_editor";
import { validateLandingPage } from "./components/parser";
import { PreviewCanvas } from "./components/preview_canvas";
import "./App.css";
import { buildSettingsForLandingElement } from "./components/element_settings_builder";
import { type LandingElement, type LandingPage } from "./components/types";
import { landingElementUpdater } from "./components/handlers/update_element";

const DEFAULT_DATA = JSON.stringify({ elements: [] }, null, 2);
type UpdatePageCallback = (updated: LandingPage) => void;
type Direction = "up" | "down";

interface ElementPosition {
	parentId: string;
	index: number;
}

function findElementById(page: LandingPage, elementId: string): LandingElement {
	for (const element of page.elements) {
		if (element.id === elementId) {
			return element;
		}
	}

	throw new Error(`Element with ID '${elementId}' not found`);
}

const getNeighborElements = (
	element: LandingElement,
	elements: LandingElement[],
): {
	prevElement: LandingElement | null;
	nextElement: LandingElement | null;
} => {
	const processed = elements
		.filter((el) => el.parentId === element.parentId && el.id !== element.id)
		.sort((a, b) => a.index - b.index);

	const prevIndex = processed.findLastIndex((el) => el.index <= element.index);
	const nextIndex = processed.findIndex((el) => el.index >= element.index);

	return {
		prevElement: prevIndex !== -1 ? processed[prevIndex] : null,
		nextElement: nextIndex !== -1 ? processed[nextIndex] : null,
	};
};

const getUpdatedPosition = (
	element: LandingElement,
	page: LandingPage,
	direction: Direction,
): ElementPosition => {
	const { prevElement, nextElement } = getNeighborElements(
		element,
		page.elements,
	);

	if (direction === "up" && prevElement === null) {
		const parentElement = findElementById(page, element.parentId);
		return {
			parentId: parentElement.parentId,
			index: parentElement.index - 0.5,
		};
	} else if (direction === "down" && nextElement === null) {
		const parentElement = findElementById(page, element.parentId);
		return {
			parentId: parentElement.parentId,
			index: parentElement.index + 0.5,
		};
	} else if (direction === "down" && nextElement?.element === "container") {
		return {
			parentId: nextElement.id,
			index: -1,
		};
	} else if (direction === "up" && prevElement?.element === "container") {
		return {
			parentId: prevElement.id,
			index: Infinity,
		};
	} else {
		const delta = direction === "up" ? -1.5 : 1.5;
		return { parentId: element.parentId, index: element.index + delta };
	}
};

function normalizeIndexes(page: LandingPage): LandingPage {
	const newElements = page.elements.map((el) => ({ ...el }));
	const groupsByParent: Record<string, LandingElement[]> = {};

	for (const element of newElements) {
		if (!groupsByParent[element.parentId]) {
			groupsByParent[element.parentId] = [];
		}
		groupsByParent[element.parentId].push(element);
	}

	for (const parentId in groupsByParent) {
		const siblings = groupsByParent[parentId];
		siblings.sort((a, b) => a.index - b.index);
		siblings.forEach((element, newIndex) => {
			element.index = newIndex;
		});
	}

	return {
		...page,
		elements: newElements,
	};
}

const moveElement = (
	page: LandingPage | null,
	elementId: string,
	direction: Direction,
	onUpdate: UpdatePageCallback,
) => {
	if (page === null) {
		console.warn("Unable to update not created page");
		return;
	}

	const element = findElementById(page, elementId);
	const updatedPosition = getUpdatedPosition(element, page, direction);
	const updatedElements = page.elements.map((el) =>
		el.id === element.id ? { ...el, ...updatedPosition } : el,
	);
	onUpdate(normalizeIndexes({ elements: updatedElements }));
};

function App() {
	const [landingData, setLandingData] = useState<string>(DEFAULT_DATA);
	const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [settingsElementId, setSettingsElementId] = useState<string | null>(
		null,
	);

	const updateData = (updated: LandingPage) => {
		setLandingPage(updated);
		setLandingData(JSON.stringify(updated, null, 2));
	};
	const updater = landingElementUpdater(landingPage, updateData);
	const onSettingsOpened = (element: LandingElement) => {
		setSettingsElementId(element.id);
	};

	const moveElementHandler = (element: LandingElement, direction: Direction) =>
		moveElement(landingPage, element.id, direction, updateData);

	const handleRender = (data: string) => {
		try {
			setLandingPage(validateLandingPage(JSON.parse(data)));
			setErrorMessage(null);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setErrorMessage("Invalid JSON data: " + err.toString());
			}
		}
	};

	return (
		<div className="app-container">
			<div className="editor-container">
				<JsonEditor
					onRender={handleRender}
					errorMessage={errorMessage}
					value={landingData}
					onChange={setLandingData}
				/>
				<PreviewCanvas>
					{landingPage &&
						renderElements(
							landingPage.elements,
							onSettingsOpened,
							moveElementHandler,
						)}
				</PreviewCanvas>
				{landingPage &&
					settingsElementId &&
					buildSettingsForLandingElement(
						findElementById(landingPage, settingsElementId),
						updater,
						() => setSettingsElementId(null),
					)}
			</div>
		</div>
	);
}

export default App;
