import { type LandingElement } from "./types";
import { TextElementComponent, LinkElementComponent, ImageElementComponent, ButtonElementComponent, ContainerElementComponent } from './editor_components';

class ElementNotSupportsChildren extends Error {
  constructor(elementType: string) {
    super(`Element of type "${elementType}" not supports children`);
  }
}

function renderElement(element: LandingElement, children: React.ReactNode[]): React.ReactNode {
  if (element.element !== "container" && children.length > 0) {
    throw new ElementNotSupportsChildren(element.element);
  }

  if (element.element === "text") return <TextElementComponent element={element} />
  else if (element.element === "link") return <LinkElementComponent element={element} />
  else if (element.element === "image") return <ImageElementComponent element={element} />
  else if (element.element === "button") return <ButtonElementComponent element={element} />
  else if (element.element === "container") return <ContainerElementComponent element={element}>{children}</ContainerElementComponent>
}

export function renderElements(elements: LandingElement[], parentId: string | null = null): React.ReactNode[] {
  return elements
    .filter(el => (parentId === null && !el.parentId) || (el.parentId === parentId))
    .sort((a, b) => a.index - b.index)
    .map(el => renderElement(el, renderElements(elements, el.id)));
}
