import closeIcon from "../../assets/close-btn.png";
import styles from "./drawer.module.css";

interface DrawerParams {
	title: string;
	children: React.ReactNode | React.ReactNode[];
	onClose?: () => void;
}

export const Drawer = ({ title, children, onClose }: DrawerParams) => {
	return (
		<div className={styles.drawer}>
			<Header title={title} onClose={onClose} />
			<Body>{children}</Body>
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
			{onClose && <CloseButton onClick={onClose} />}
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

const CloseButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className={styles.closeButton} onClick={onClick}>
			<img className={styles.closeIcon} src={closeIcon} />
		</div>
	);
};
