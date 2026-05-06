import {
	ButtonElementComponent,
	ContainerElementComponent,
	ImageElementComponent,
	LinkElementComponent,
	type OpenSettingsCallback,
	TextElementComponent,
} from "./editor_components";
import { type LandingElement } from "./types";

type MoveElementCallback = (
	element: LandingElement,
	direction: "up" | "down",
) => void;

class ElementNotSupportsChildren extends Error {
	constructor(elementType: string) {
		super(`Element of type "${elementType}" not supports children`);
	}
}

function renderElement(
	element: LandingElement,
	children: React.ReactNode[],
	onSettingsOpened: OpenSettingsCallback,
	onMoveUp?: () => void,
	onMoveDown?: () => void,
): React.ReactNode {
	if (element.element !== "container" && children.length > 0) {
		throw new ElementNotSupportsChildren(element.element);
	}

	if (element.element === "text")
		return (
			<TextElementComponent
				element={element}
				onSettingsOpened={onSettingsOpened}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
			/>
		);
	else if (element.element === "link")
		return (
			<LinkElementComponent
				element={element}
				onSettingsOpened={onSettingsOpened}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
			/>
		);
	else if (element.element === "image")
		return (
			<ImageElementComponent
				element={element}
				onSettingsOpened={onSettingsOpened}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
			/>
		);
	else if (element.element === "button")
		return (
			<ButtonElementComponent
				element={element}
				onSettingsOpened={onSettingsOpened}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
			/>
		);
	else if (element.element === "container")
		return (
			<ContainerElementComponent
				element={element}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
			>
				{children}
			</ContainerElementComponent>
		);
}

export function renderElements(
	elements: LandingElement[],
	onSettingsOpened: OpenSettingsCallback,
	onMove: MoveElementCallback,
	parentId: string = "root",
): React.ReactNode[] {
	const processedElements = elements
		.filter((el) => el.parentId === parentId)
		.sort((a, b) => a.index - b.index);

	return processedElements.map((el, index) => {
		const canMoveUp = index !== 0 || parentId !== "root";
		const canMoveDown =
			index !== processedElements.length - 1 || parentId !== "root";

		return renderElement(
			el,
			renderElements(elements, onSettingsOpened, onMove, el.id),
			onSettingsOpened,
			canMoveUp ? () => onMove(el, "up") : undefined,
			canMoveDown ? () => onMove(el, "down") : undefined,
		);
	});
}
