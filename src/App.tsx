import React, { useState } from 'react';
import './App.css';

type ElementId = string;

interface BaseElement {
  id: ElementId;
  element: string;
  parentId?: string;
  index: number;
}

interface TextElement extends BaseElement {
  element: "text";
  value: string;
}

interface LinkElement extends BaseElement {
  element: "link";
  value: string;
  src: string;
}

interface ImageElement extends BaseElement {
  element: "image";
  value: string;
  alt?: string;
}

interface ButtonElement extends BaseElement {
  element: "button";
  value: string;
  src: string;
}

interface ContainerElement extends BaseElement {
  element: "container";
}

type LandingElement = TextElement | LinkElement | ImageElement | ButtonElement | ContainerElement

interface LandingPage {
  elements: LandingElement[];
}

const INITIAL_JSON = JSON.stringify({elements: []}, null, 2);

const JsonEditor = ({ onRender, errorMessage }: { onRender: (val: string) => void, errorMessage: string | null }) => {
  const [editorValue, setEditorValue] = useState<string>(INITIAL_JSON);

  return (
    <div className="editor-pane">
      <textarea
        className="json-input"
        value={editorValue}
        onChange={(e) => setEditorValue(e.target.value)}
        spellCheck={false}
      />

      {errorMessage !== null ? <div className="error-message">{errorMessage}</div> : undefined}

      <div className="toolbar">
        <button className="btn-render" onClick={() => onRender(editorValue)}>
          Render
        </button>
      </div>
    </div>
  );
};

const LandingElementEditContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="element-edit-container">{children}</div>
}

const TextElementComponent = ({ element }: { element: TextElement }) => {
  return <LandingElementEditContainer key={element.id}>
    <p className="text-element">{element.value}</p>
  </LandingElementEditContainer>
}

const LinkElementComponent = ({ element }: { element: LinkElement }) => {
  return <LandingElementEditContainer key={element.id}>
    <a className="link-element" href={element.src}>{element.value}</a>
  </LandingElementEditContainer>
}

const ImageElementComponent = ({ element }: { element: ImageElement }) => {
  return <LandingElementEditContainer key={element.id}>
    <img className="image-element" src={element.value} alt={element.alt} />
  </LandingElementEditContainer>
}

const LinkButton = ({ text, href }: { text: string, href: string }) => {
  const handleClick = () => window.open(href, '_blank');
  return <button className="link-button" onClick={handleClick}>{text}</button>;
}

const ButtonElementComponent = ({ element }: { element: ButtonElement }) => {
  return <LandingElementEditContainer key={element.id}>
    <LinkButton text={element.value} href={element.src} />
  </LandingElementEditContainer>
}

const ContainerElementComponent = ({ element, children }: { element: ContainerElement, children: React.ReactNode[] }) => {
  return <LandingElementEditContainer key={element.id}>
    {children}
  </LandingElementEditContainer>
}

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

function renderElements(elements: LandingElement[], parentId: string | null = null): React.ReactNode[] {
  return elements
    .filter(el => (parentId === null && !el.parentId) || (el.parentId === parentId))
    .sort((a, b) => a.index - b.index)
    .map(el => renderElement(el, renderElements(elements, el.id)));
}

const PreviewCanvas = ({ data }: { data: LandingPage | null }) => {
  if (!data) {
    return (
      <div className="preview-pane">
        <div className="empty-state">
          <p>Нажмите кнопку Render, чтобы увидеть предпросмотр</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-pane">
      <div className="preview-content">
        {renderElements(data.elements)}
      </div>
    </div>
  );
};

function App() {
  const [renderedData, setRenderedData] = useState<LandingPage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRender = (data: string) => {
    try {
      setRenderedData(JSON.parse(data));
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Invalid JSON data: " + err.toString());
    }
  };

  return (
    <div className="app-container">
      <div className="editor-container">
          <JsonEditor onRender={handleRender} errorMessage={errorMessage} />
          <PreviewCanvas data={renderedData} />
      </div>
    </div>
  );
}

export default App;
