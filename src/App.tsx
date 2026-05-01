import React, { useState } from 'react';
import { validateLandingPage } from './components/parser';
import { renderElements } from './components/editor_components_renderer';
import { PreviewCanvas } from './components/preview_canvas';
import { JsonEditor } from './components/json_editor';
import './App.css';
import { type LandingElement, type LandingPage } from './components/types';


const landingPageUpdater = (page: LandingPage | null, onUpdate: (updated: LandingPage) => void) => {
  return (updated: LandingElement) => {
    if (page === null) {
      console.warn("Unable to update not created page");
      return;
    }

    let found = false;
    const newElements = page.elements.map(el => {
      if (el.id === updated.id) {
        found = true;
        return updated;
      }
      return el;
    });

    if (found) {
      onUpdate({ elements: newElements });
    } else {
      console.warn(`TextElement with id "${updated.id}" not found.`);
    }

    return { ...page, elements: newElements };
  };
};


function App() {
  const [_, setLandingPage] = useState<LandingPage | null>(null);
  const [renderedData, setRenderedData] = useState<React.ReactNode[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRender = (data: string) => {
    try {
      const landingPage = validateLandingPage(JSON.parse(data));
      setLandingPage(landingPage);

      const updater = landingPageUpdater(landingPage, setLandingPage);
      const elements = renderElements(landingPage.elements, updater);
      setRenderedData(elements);
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
