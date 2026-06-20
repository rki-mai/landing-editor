import {
	ButtonElementComponent,
	ContainerElementComponent,
	ImageElementComponent,
	LinkElementComponent,
	TextElementComponent,
} from "./editor_components";
import { type LandingElement } from "./types";

type SelectCallback = (element: LandingElement) => void;

class ElementNotSupportsChildren extends Error {
	constructor(elementType: string) {
		super(`Element of type "${elementType}" not supports children`);
	}
}

function renderElement(
	element: LandingElement,
	selectedElementId: string | null,
	onSelect: SelectCallback,
	children: React.ReactNode[],
): React.ReactNode {
	if (element.element !== "container" && children.length > 0) {
		throw new ElementNotSupportsChildren(element.element);
	}

	const props = {
		onClick: () => onSelect(element),
		isSelected: element.id === selectedElementId,
	};

	if (element.element === "text")
		return <TextElementComponent element={element} {...props} />;
	else if (element.element === "link")
		return <LinkElementComponent element={element} {...props} />;
	else if (element.element === "image")
		return <ImageElementComponent element={element} {...props} />;
	else if (element.element === "button")
		return <ButtonElementComponent element={element} {...props} />;
	else if (element.element === "container")
		return (
			<ContainerElementComponent element={element} {...props}>
				{children}
			</ContainerElementComponent>
		);
}

export function renderElements(
	elements: LandingElement[],
	selectedElementId: string | null,
	onSelect: SelectCallback,
	parentId: string = "root",
): React.ReactNode[] {
	const processedElements = elements
		.filter((el) => el.parentId === parentId)
		.sort((a, b) => a.index - b.index);

	return processedElements.map((el) => {
		return renderElement(
			el,
			selectedElementId,
			onSelect,
			renderElements(elements, selectedElementId, onSelect, el.id),
		);
	});
}
