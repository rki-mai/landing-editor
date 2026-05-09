import React, { useState } from "react";
import styles from "./edit_area.module.css";

export const ActionMenuItem = ({
	name,
	onClick,
	children,
}: {
	name: string;
	onClick: () => void;
	children?: React.ReactNode | React.ReactNode[];
}) => {
	return (
		<div className={styles.actionMenuItem} onClick={onClick}>
			{name}
			{children}
		</div>
	);
};

export const ActionListItem = ({
	name,
	onClick,
}: {
	name: string;
	onClick: () => void;
}) => {
	return (
		<div className={styles.actionListItem} onClick={onClick}>
			{name}
		</div>
	);
};

const ActionList = ({ children }: { children: React.ReactNode[] }) => {
	return <div className={styles.actionList}>{children}</div>;
};

export const ActionListMenuItem = ({
	name,
	children,
}: {
	name: string;
	children: React.ReactNode[];
}) => {
	const [showList, setShowList] = useState<boolean>(false);
	const toggleShowList = () => setShowList(!showList);

	return (
		<ActionMenuItem name={name} onClick={toggleShowList}>
			{showList && <ActionList>{children}</ActionList>}
		</ActionMenuItem>
	);
};

export const ActionMenu = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div className={styles.actionMenu}>{children}</div>;
};

export const PreviewContainer = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div className={styles.previewContainer}>{children}</div>;
};

export const EditArea = ({ children }: { children: React.ReactNode[] }) => {
	return <div className={styles.editArea}>{children}</div>;
};
