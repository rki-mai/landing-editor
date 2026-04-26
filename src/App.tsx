import React, { useState } from 'react';
import * as types from './components/types';
import { validateLandingPage } from './components/parser';
import { TextElementComponent, LinkElementComponent, ImageElementComponent, ButtonElementComponent, ContainerElementComponent } from './components/editor_components';
import './App.css';

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

class ElementNotSupportsChildren extends Error {
  constructor(elementType: string) {
    super(`Element of type "${elementType}" not supports children`);
  }
}

function renderElement(element: types.LandingElement, children: React.ReactNode[]): React.ReactNode {
  if (element.element !== "container" && children.length > 0) {
    throw new ElementNotSupportsChildren(element.element);
  }

  if (element.element === "text") return <TextElementComponent element={element} />
  else if (element.element === "link") return <LinkElementComponent element={element} />
  else if (element.element === "image") return <ImageElementComponent element={element} />
  else if (element.element === "button") return <ButtonElementComponent element={element} />
  else if (element.element === "container") return <ContainerElementComponent element={element}>{children}</ContainerElementComponent>
}

function renderElements(elements: types.LandingElement[], parentId: string | null = null): React.ReactNode[] {
  return elements
    .filter(el => (parentId === null && !el.parentId) || (el.parentId === parentId))
    .sort((a, b) => a.index - b.index)
    .map(el => renderElement(el, renderElements(elements, el.id)));
}

const PreviewCanvas = ({ data }: { data: types.LandingPage | null }) => {
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
  const [renderedData, setRenderedData] = useState<types.LandingPage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRender = (data: string) => {
    try {
      setRenderedData(validateLandingPage(JSON.parse(data)));
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
