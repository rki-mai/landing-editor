import { Spinner } from "@heroui/react";
import React from "react";

export const PreviewCanvas = ({
	children,
}: {
	children: React.ReactNode[] | null;
}) => {
	return (
		<div>
			{children ? (
				<div className="flex flex-col gap-4 grow">{children}</div>
			) : (
				<div className="empty-state">
					<div className="flex flex-col items-center gap-2 grow">
						<Spinner size="xl" />
						<span className="text-xs text-muted">Загрузка ...</span>
					</div>
				</div>
			)}
		</div>
	);
};
