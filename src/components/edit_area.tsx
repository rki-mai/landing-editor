import { Button, ButtonGroup } from "@heroui/react";
import React, { type PropsWithChildren } from "react";
import styles from "./edit_area.module.css";

interface ActionMenuItemProps extends PropsWithChildren {
	iconOnly?: boolean;
	onClick?: () => void;
	isDisabled?: boolean;
}

interface ActionMenuItemGroupProps extends PropsWithChildren {
	isDisabled?: boolean;
}

export const ActionMenuItem = ({
	iconOnly,
	onClick,
	children,
	isDisabled,
}: ActionMenuItemProps) => {
	return (
		<Button
			onClick={onClick}
			isDisabled={isDisabled}
			variant="tertiary"
			isIconOnly={iconOnly}
		>
			{children}
		</Button>
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

export const ActionMenuItemGroup = ({
	isDisabled,
	children,
}: ActionMenuItemGroupProps) => {
	return <ButtonGroup isDisabled={isDisabled}>{children}</ButtonGroup>;
};

export const ActionMenu = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div className="flex gap-4">{children}</div>;
};

export const PreviewContainer = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div className={styles.previewContainer}>{children}</div>;
};

export const EditArea = ({ children }: PropsWithChildren) => {
	return <div className={`${styles.editArea} gap-4`}>{children}</div>;
};
