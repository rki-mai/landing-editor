import type React from "react";

export const ActionMenuItem = ({
	name,
	onClick,
}: {
	name: string;
	onClick: () => void;
}) => {
	return <div onClick={onClick}>{name}</div>;
};

export const ActionMenu = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div>{children}</div>;
};

export const EditArea = ({ children }: { children: React.ReactNode[] }) => {
	return <div>{children}</div>;
};
