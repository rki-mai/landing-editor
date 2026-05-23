import React from "react";

export const PreviewCanvas = ({
	children,
}: {
	children: React.ReactNode[] | null;
}) => {
	return (
		<div className="preview-pane">
			{children ? (
				<div className="preview-content">{children}</div>
			) : (
				<div className="empty-state">
					<p>Loading...</p>
				</div>
			)}
		</div>
	);
};
