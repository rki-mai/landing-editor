import { CloseButton, Surface } from "@heroui/react";
import styles from "./drawer.module.css";

interface DrawerParams {
	title: string;
	children: React.ReactNode | React.ReactNode[];
	onClose?: () => void;
}

export const Drawer = ({ title, children, onClose }: DrawerParams) => {
	return (
		<div className="min-w-xl p-4 max-h-full">
			<Surface
				className="flex flex-col flex-1 rounded-4xl p-4 max-h-full"
				variant="default"
			>
				<Header title={title} onClose={onClose} />
				<Body>{children}</Body>
			</Surface>
		</div>
	);
};

interface HeaderParams {
	title: string;
	onClose?: () => void;
}

const Header = ({ title, onClose }: HeaderParams) => {
	return (
		<div className={styles.header}>
			<div className={styles.headerTitle}>{title}</div>
			{onClose && (
				<div className={styles.closeButton}>
					<CloseButton className="rounded-full" onClick={onClose} />
				</div>
			)}
		</div>
	);
};

const Body = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div className={styles.body}>{children}</div>;
};
