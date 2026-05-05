export const JsonEditor = ({
	value,
	onRender,
	onChange,
	errorMessage,
}: {
	value: string;
	onRender: (val: string) => void;
	onChange: (value: string) => void;
	errorMessage: string | null;
}) => {
	return (
		<div className="editor-pane">
			<textarea
				className="json-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				spellCheck={false}
			/>

			{errorMessage !== null ? (
				<div className="error-message">{errorMessage}</div>
			) : undefined}

			<div className="toolbar">
				<button className="btn-render" onClick={() => onRender(value)}>
					Render
				</button>
			</div>
		</div>
	);
};
