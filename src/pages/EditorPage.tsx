import { useState } from "react";
import {
	ApiClient,
	ProjectNotFound,
	TokenProviderError,
	Unauthorized,
} from "../components/apiClient";
import { runBackgroundTask } from "../components/backgroundTask";
import * as draftUpdater from "../components/draftUpdater";
import {
	ActionListItem,
	ActionListMenuItem,
	ActionMenu,
	EditArea,
	PreviewContainer,
} from "../components/edit_area";
import { renderElements } from "../components/editor_components_renderer";
import {
	createButtonElement,
	createContainerElement,
	createImageElement,
	createLinkElement,
	createTextElement,
} from "../components/element_factory";
import { buildSettingsForLandingElement } from "../components/element_settings_builder";
import { createElementHandler } from "../components/handlers/create_element";
import { deleteElementHandler } from "../components/handlers/delete_element";
import { moveElementHandler } from "../components/handlers/move_element";
import { landingElementUpdater } from "../components/handlers/update_element";
import { loadPageFromApi } from "../components/landingPageApiLoader";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import { PreviewCanvas } from "../components/preview_canvas";
import { type LandingElement, type LandingPage } from "../components/types";
import { findElementById } from "../components/utils";

function EditorPage({ projectId }: { projectId: string | null }) {
	const tokenProvider = new LocalStorageTokenProvider(
		new ApiClient({ baseUrl: "" }),
	);

	const apiClient = new ApiClient({
		baseUrl: "",
		tokenProvider,
	});

	const [landingPage, setLandingPage] = useState<LandingPage | null>(null);

	runBackgroundTask("fetchInitialDraft", async () => {
		try {
			if (projectId === null) {
				window.location.href = "/projects";
				return;
			}

			const landingPage = await loadPageFromApi(apiClient, projectId);
			setLandingPage(landingPage);

			runBackgroundTask("draftUpdater", async () => {
				await draftUpdater.run(apiClient, projectId, landingPage);
			});
		} catch (err) {
			if (err instanceof TokenProviderError || err instanceof Unauthorized) {
				tokenProvider.clearCredentials();
				window.location.href = "/login";
				return;
			}

			if (err instanceof ProjectNotFound) {
				window.location.href = "/projects";
				return;
			}
		}
	});

	const updateLandingPage = (updated: LandingPage) => {
		draftUpdater.updateLandingPage(updated);
		setLandingPage(updated);
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
						<ActionListMenuItem name="Создать">
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

export default EditorPage;
