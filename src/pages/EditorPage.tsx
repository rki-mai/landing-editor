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
	ActionMenu,
	ActionMenuItem,
	ActionMenuItemGroup,
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
import { PageContent, PageHeader, PageLayout } from "../components/PageLayout";
import { SquareButton } from "../components/squareButton";
import { ArrowLeft, Plus } from "@gravity-ui/icons";
import { UserMenu } from "../components/UserMenu";
import { Dropdown, Label, Spinner, type Key } from "@heroui/react";
import {
	DeleteElementAction,
	MoveDownAction,
	MoveUpAction,
	OpenSettingsAction,
} from "../components/EditorActions";
import { Text, Archive, Box, Picture, Link } from "@gravity-ui/icons";

const CreateElementType = {
	TEXT: "text",
	IMAGE: "image",
	CONTAINER: "container",
	LINK: "link",
	BUTTON: "button",
} as const;

function EditorPage({ projectId }: { projectId: string | null }) {
	const tokenProvider = new LocalStorageTokenProvider(
		new ApiClient({ baseUrl: "" }),
	);

	const apiClient = new ApiClient({
		baseUrl: "",
		tokenProvider,
	});

	const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
	const [settingsElementId, setSettingsElementId] = useState<string | null>(
		null,
	);
	const [selectedElementId, setSelectedElementId] = useState<string | null>(
		null,
	);
	const [projectName, setProjectName] = useState<string | null>(null);

	runBackgroundTask("fetchProject", async () => {
		if (projectId === null) {
			window.location.href = "/projects";
			return;
		}

		setProjectName(await getProjectName(projectId, apiClient));
	});

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

		const elementIds = updated.elements.map((el) => el.id);
		if (settingsElementId && !elementIds.includes(settingsElementId)) {
			setSettingsElementId(null);
		}
	};

	const onSettingsOpened = (element: LandingElement) => {
		setSettingsElementId(element.id);
	};

	const updater = landingElementUpdater(landingPage, updateLandingPage);
	const moveHandler = moveElementHandler(landingPage, updateLandingPage);
	const createElement = createElementHandler(landingPage, updateLandingPage);
	const deleteHandler = deleteElementHandler(landingPage, updateLandingPage);

	const selectedElement =
		landingPage !== null && selectedElementId !== null
			? findElementById(landingPage, selectedElementId)
			: null;

	const onSelect = (element: LandingElement) => {
		setSelectedElementId(element.id);
		console.log("Element selected: ", element);
	};

	const onDelete = (element: LandingElement) => {
		deleteHandler(element);
		setSelectedElementId(null);
		setSettingsElementId(null);
	};

	return (
		<div className="flex">
			<PageLayout>
				<PageHeader>
					<div className="flex grow-0 items-center">
						<MoveBackButton />
					</div>
					<div className="flex grow items-center justify-center">
						<ProjectName projectName={projectName} />
					</div>
					<div className="flex grow-0 items-center">
						<UserMenu />
					</div>
				</PageHeader>
				<PageContent>
					<EditArea>
						<ActionMenu>
							<Dropdown>
								<ActionMenuItem>
									<Plus />
									Создать
								</ActionMenuItem>
								<Dropdown.Popover>
									<Dropdown.Menu
										onAction={(key) => createElement(getElementFactory(key))}
									>
										<Dropdown.Item id={CreateElementType.TEXT} textValue="Text">
											<Text />
											<Label>Текст</Label>
										</Dropdown.Item>
										<Dropdown.Item
											id={CreateElementType.BUTTON}
											textValue="Button"
										>
											<Archive />
											<Label>Кнопка</Label>
										</Dropdown.Item>
										<Dropdown.Item
											id={CreateElementType.CONTAINER}
											textValue="Container"
										>
											<Box />
											<Label>Контейнер</Label>
										</Dropdown.Item>
										<Dropdown.Item
											id={CreateElementType.IMAGE}
											textValue="Container"
										>
											<Picture />
											<Label>Изображение</Label>
										</Dropdown.Item>
										<Dropdown.Item id={CreateElementType.LINK} textValue="Link">
											<Link />
											<Label>Ссылка</Label>
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown.Popover>
							</Dropdown>

							<ActionMenuItemGroup>
								<OpenSettingsAction
									element={selectedElement}
									handler={onSettingsOpened}
								/>
								<DeleteElementAction
									element={selectedElement}
									handler={onDelete}
								/>
								<MoveUpAction
									element={selectedElement}
									handler={(element) => moveHandler(element, "up")}
								/>
								<MoveDownAction
									element={selectedElement}
									handler={(element) => moveHandler(element, "down")}
								/>
							</ActionMenuItemGroup>
						</ActionMenu>
						<PreviewContainer>
							<PreviewCanvas>
								{landingPage &&
									renderElements(
										landingPage.elements,
										selectedElementId,
										onSelect,
									)}
							</PreviewCanvas>
						</PreviewContainer>
					</EditArea>
				</PageContent>
			</PageLayout>
			{landingPage &&
				settingsElementId &&
				buildSettingsForLandingElement(
					findElementById(landingPage, settingsElementId),
					updater,
					() => setSettingsElementId(null),
				)}
		</div>
	);
}

const getElementFactory = (actionKey: Key) => {
	switch (actionKey) {
		case CreateElementType.TEXT:
			return createTextElement;
		case CreateElementType.BUTTON:
			return createButtonElement;
		case CreateElementType.IMAGE:
			return createImageElement;
		case CreateElementType.CONTAINER:
			return createContainerElement;
		case CreateElementType.LINK:
			return createLinkElement;
		default:
			throw Error(`Unknown type ${actionKey}`);
	}
};

const MoveBackButton = () => {
	const onClick = () => {
		window.location.pathname = "/projects";
		return;
	};

	return (
		<SquareButton onClick={onClick}>
			<ArrowLeft />
		</SquareButton>
	);
};

const getProjectName = async (projectId: string, apiClient: ApiClient) => {
	const projects = await apiClient.getProjects();

	for (const project of projects.projects || []) {
		if (project.id === projectId) {
			return project.name;
		}
	}

	throw new Error("Unable to find project");
};

const ProjectName = ({ projectName }: { projectName: string | null }) => {
	if (projectName === null) {
		return <Spinner size="sm" />;
	}

	return <span className="font-bold">{projectName}</span>;
};

export default EditorPage;
