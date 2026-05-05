import React, { useState } from 'react';
import { validateLandingPage } from './components/parser';
import { renderElements } from './components/editor_components_renderer';
import { PreviewCanvas } from './components/preview_canvas';
import { JsonEditor } from './components/json_editor';
import './App.css';
import { type LandingElement, type LandingPage } from './components/types';
import { buildSettingsForLandingElement } from './components/element_settings_builder';


const DEFAULT_DATA = JSON.stringify({ elements: [] }, null, 2);


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


function findElementById(page: LandingPage, elementId: string): LandingElement {
  for (const element of page.elements) {
    if (element.id === elementId) {
      return element;
    }
  }

  throw new Error(`Element with ID '${elementId}' not found`);
}


function App() {
  const [landingData, setLandingData] = useState<string>(DEFAULT_DATA);
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settingsElementId, setSettingsElementId] = useState<string | null>(null);

  const updateData = (updated: LandingPage) => {
    setLandingPage(updated);
    setLandingData(JSON.stringify(updated, null, 2))
  }
  const updater = landingPageUpdater(landingPage, updateData);
  const onSettingsOpened = (element: LandingElement) => {
    setSettingsElementId(element.id);
  }

  const handleRender = (data: string) => {
    try {
      setLandingPage(validateLandingPage(JSON.parse(data)));
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Invalid JSON data: " + err.toString());
    }
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <JsonEditor
          onRender={handleRender}
          errorMessage={errorMessage}
          value={landingData}
          onChange={setLandingData}
        />
        <PreviewCanvas>{landingPage && renderElements(landingPage.elements, onSettingsOpened)}</PreviewCanvas>
        { landingPage && settingsElementId && buildSettingsForLandingElement(findElementById(landingPage, settingsElementId), updater, () => setSettingsElementId(null)) }
      </div>
    </div>
  );
}

export default App;
