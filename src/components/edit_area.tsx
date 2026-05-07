import React from "react";
import styles from "./edit_area.module.css";

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
