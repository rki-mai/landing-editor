import { Tabs, type TabProps } from "./Tabs";
import { UserMenu } from "./UserMenu";

interface PageLayoutProps {
	children: React.ReactElement[];
}

interface PageContentProps {
	children: React.ReactElement | React.ReactElement[];
}

interface PageHeaderProps {
	children: React.ReactElement<TabProps>[];
}

export const PageHeader = ({ children }: PageHeaderProps) => {
	return (
		<div className="flex gap-4">
			<div className="grow">
				<Tabs>{children}</Tabs>
			</div>
			<div className="flex grow-0 items-center">
				<UserMenu />
			</div>
		</div>
	);
};

export const PageLayout = ({ children }: PageLayoutProps) => {
	return (
		<div className="flex p-4 items-center justify-center w-full">
			<div className="flex flex-col gap-4 max-w-4xl grow">{children}</div>
		</div>
	);
};

export const PageContent = ({ children }: PageContentProps) => {
	return <div className="flex flex-col gap-4 grow">{children}</div>;
};
