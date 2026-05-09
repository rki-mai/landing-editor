import { useState } from "react";
import { renderElements } from "./components/editor_components_renderer";
import { JsonEditor } from "./components/json_editor";
import { validateLandingPage } from "./components/parser";
import { PreviewCanvas } from "./components/preview_canvas";
import "./App.css";
import { buildSettingsForLandingElement } from "./components/element_settings_builder";
import { moveElementHandler } from "./components/handlers/move_element";
import { landingElementUpdater } from "./components/handlers/update_element";
import { type LandingElement, type LandingPage } from "./components/types";
import {
	ActionListItem,
	ActionMenu,
	ActionListMenuItem,
	EditArea,
	PreviewContainer,
} from "./components/edit_area";
import { createElementHandler } from "./components/handlers/create_element";
import {
	createButtonElement,
	createContainerElement,
	createImageElement,
	createLinkElement,
	createTextElement,
} from "./components/element_factory";

const DEFAULT_DATA = JSON.stringify({ elements: [] }, null, 2);

function findElementById(page: LandingPage, elementId: string): LandingElement {
	for (const element of page.elements) {
		if (element.id === elementId) {
			return element;
		}
	}

	throw new Error(`Element with ID '${elementId}' not found`);
}

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
	const onSettingsOpened = (element: LandingElement) => {
		setSettingsElementId(element.id);
	};

	const updater = landingElementUpdater(landingPage, updateData);
	const moveHandler = moveElementHandler(landingPage, updateData);
	const createElement = createElementHandler(landingPage, updateData);

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
				<EditArea>
					<ActionMenu>
						<ActionListMenuItem name="Create component">
							<ActionListItem
								name="Text"
								onClick={() => createElement(createTextElement)}
							/>
							<ActionListItem
								name="Image"
								onClick={() => createElement(createImageElement)}
							/>
							<ActionListItem
								name="Link"
								onClick={() => createElement(createLinkElement)}
							/>
							<ActionListItem
								name="Button"
								onClick={() => createElement(createButtonElement)}
							/>
							<ActionListItem
								name="Container"
								onClick={() => createElement(createContainerElement)}
							/>
						</ActionListMenuItem>
					</ActionMenu>
					<PreviewContainer>
						<PreviewCanvas>
							{landingPage &&
								renderElements(
									landingPage.elements,
									onSettingsOpened,
									moveHandler,
								)}
						</PreviewCanvas>
					</PreviewContainer>
				</EditArea>
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
