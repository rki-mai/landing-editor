import { Tabs as HeroTabs } from "@heroui/react";
import React from "react";

export interface TabProps {
	title: string;
	id: string;
	isSelected: boolean;
	href: string;
}

export const Tab = ({
	title,
	id,
	isSelected,
	href,
}: TabProps): React.ReactElement<TabProps> => {
	const navigateByURL = () => {
		if (!isSelected) {
			window.location.pathname = href;
			return;
		}
	};

	return (
		<HeroTabs.Tab id={id} className="rounded-full" onClick={navigateByURL}>
			{title}
			<HeroTabs.Indicator className="rounded-full" isSelected={isSelected} />
		</HeroTabs.Tab>
	);
};

export const Tabs = ({
	children,
}: {
	children: React.ReactElement<TabProps>[];
}) => {
	const selectedTab = children.find((el) => el.props.isSelected);
	console.log("Selected tab: ", selectedTab);

	console.log("Tab props:", selectedTab?.props);

	const selectedKey = children.find((el) => el.props.isSelected)?.props.id;
	console.log("Selected key: ", selectedKey);
	console.log("Children: ", children);
	console.log(
		"Found child:",
		children.find((el) => el.props.isSelected),
	);

	return (
		<HeroTabs className="w-full max-w-md" selectedKey={selectedKey}>
			<HeroTabs.ListContainer>
				<HeroTabs.List aria-label="Menu" className="rounded-full">
					{children}
				</HeroTabs.List>
			</HeroTabs.ListContainer>
		</HeroTabs>
	);
};
