import { useState } from "react";


const INITIAL_JSON = JSON.stringify({elements: []}, null, 2);


export const JsonEditor = ({ onRender, errorMessage }: { onRender: (val: string) => void, errorMessage: string | null }) => {
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
