import { useState } from "react";
import { renderElements } from "./components/editor_components_renderer";
import { PreviewCanvas } from "./components/preview_canvas";
import "./App.css";
import {
	ActionListItem,
	ActionListMenuItem,
	ActionMenu,
	EditArea,
	PreviewContainer,
} from "./components/edit_area";
import {
	createButtonElement,
	createContainerElement,
	createImageElement,
	createLinkElement,
	createTextElement,
} from "./components/element_factory";
import { buildSettingsForLandingElement } from "./components/element_settings_builder";
import { createElementHandler } from "./components/handlers/create_element";
import { deleteElementHandler } from "./components/handlers/delete_element";
import { moveElementHandler } from "./components/handlers/move_element";
import { landingElementUpdater } from "./components/handlers/update_element";
import { type LandingElement, type LandingPage } from "./components/types";
import * as landingPageStorage from "./components/landing_page_storage";

function findElementById(page: LandingPage, elementId: string): LandingElement {
	for (const element of page.elements) {
		if (element.id === elementId) {
			return element;
		}
	}

	throw new Error(`Element with ID '${elementId}' not found`);
}

function App() {
	const [landingPage, setLandingPage] = useState<LandingPage>(
		landingPageStorage.getInitialLandingPage(),
	);

	const updateLandingPage = (updated: LandingPage) => {
		setLandingPage(updated);
		landingPageStorage.saveLandingPage(updated);
	};

	const [settingsElementId, setSettingsElementId] = useState<string | null>(
		null,
	);

	const onSettingsOpened = (element: LandingElement) => {
		setSettingsElementId(element.id);
	};

	const updater = landingElementUpdater(landingPage, updateLandingPage);
	const moveHandler = moveElementHandler(landingPage, updateLandingPage);
	const createElement = createElementHandler(landingPage, updateLandingPage);
	const deleteHandler = deleteElementHandler(landingPage, updateLandingPage);

	return (
		<div className="app-container">
			<div className="editor-container">
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
									deleteHandler,
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
