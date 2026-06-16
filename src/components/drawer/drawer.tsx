import closeIcon from "../../assets/close-btn.png";
import styles from "./drawer.module.css";

export const Drawer = ({
	title,
	children,
	onClose,
}: {
	title: string;
	children: React.ReactNode | React.ReactNode[];
	onClose: () => void;
}) => {
	return (
		<div className={styles.drawer}>
			<Header title={title} onClose={onClose} />
			<Body>{children}</Body>
		</div>
	);
};

const Header = ({ title, onClose }: { title: string; onClose: () => void }) => {
	return (
		<div className={styles.header}>
			<div className={styles.headerTitle}>{title}</div>
			<CloseButton onClick={onClose} />
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
