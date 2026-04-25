import React, { useState } from 'react';
import './App.css';

type ElementId = string;

interface BaseElement {
  id: ElementId;
  element: string;
}

interface TextElement extends BaseElement {
  element: "text";
  value: string;
}

type LandingElement = TextElement

interface LandingPage {
  elements: LandingElement[];
}

const INITIAL_JSON = JSON.stringify({elements: []}, null, 2);

const JsonEditor = ({ onRender }: { onRender: (val: string) => void }) => {
  const [editorValue, setEditorValue] = useState<string>(INITIAL_JSON);

  return (
    <div className="editor-pane">
      <textarea
        className="json-input"
        value={editorValue}
        onChange={(e) => setEditorValue(e.target.value)}
        spellCheck={false}
      />
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
    <p>{element.value}</p>
  </LandingElementEditContainer>
}

function *renderElements(elements: LandingElement[]) {
  for (const element of elements) {
    yield <TextElementComponent element={element} />
  }
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
  const handleRender = (data: string) => {
    setRenderedData(JSON.parse(data));
  };

  return (
    <div className="app-container">
      <div className="editor-container">
          <JsonEditor onRender={handleRender} />
          <PreviewCanvas data={renderedData} />
      </div>
    </div>
  );
}

export default App;
