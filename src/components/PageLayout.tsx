import type { PropsWithChildren } from "react";

interface PageHeaderProps {
	children: React.ReactElement[];
}

export const PageHeader = ({ children }: PageHeaderProps) => {
	return <div className="flex gap-4">{children}</div>;
};

export const PageLayout = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex p-4 items-center justify-center w-full">
			<div className="flex flex-col gap-4 max-w-4xl grow">{children}</div>
		</div>
	);
};

export const PageContent = ({ children }: PropsWithChildren) => {
	return <div className="flex flex-col gap-4 grow">{children}</div>;
};
