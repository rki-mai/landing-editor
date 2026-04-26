import React, { useState } from 'react';
import * as types from './components/types';
import { validateLandingPage } from './components/parser';
import { renderElements } from './components/editor_components_renderer';
import { JsonEditor } from './components/json_editor';
import './App.css';


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
