import React, { useState } from 'react';
import { validateLandingPage } from './components/parser';
import { renderElements } from './components/editor_components_renderer';
import { PreviewCanvas } from './components/preview_canvas';
import { JsonEditor } from './components/json_editor';
import './App.css';


function App() {
  const [renderedData, setRenderedData] = useState<React.ReactNode[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRender = (data: string) => {
    try {
      const parsedData = validateLandingPage(JSON.parse(data));
      setRenderedData(renderElements(parsedData.elements));
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Invalid JSON data: " + err.toString());
    }
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <JsonEditor onRender={handleRender} errorMessage={errorMessage} />
        <PreviewCanvas>{renderedData}</PreviewCanvas>
      </div>
    </div>
  );
}

export default App;
