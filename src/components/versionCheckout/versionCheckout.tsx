import eyeIcon from "../../assets/eye.svg";
import rotateIcon from "../../assets/rotate-left.svg";
import { Drawer } from "../drawer";
import { SquareButton } from "../squareButton";
import styles from "./versionCheckout.module.css";

interface VersionCheckoutWindowParams {
	onClose: () => void;
	children: React.ReactElement[] | null;
}

interface VersionItemParams {
	active: boolean;
	versionNumber: number;
	onView?: () => void;
	onCheckout?: () => void;
}

export const VersionItem = ({
	active,
	versionNumber,
	onView,
	onCheckout,
}: VersionItemParams) => {
	let className = styles.versionItem;
	if (active) {
		className = `${className} ${styles.versionItemActive}`;
	}

	return (
		<div className={className}>
			<div className={styles.versionName}>Версия {versionNumber}</div>
			<SquareButton icon={eyeIcon} variant="ghost" size={30} onClick={onView} />
			<SquareButton
				icon={rotateIcon}
				variant="ghost"
				size={30}
				onClick={onCheckout}
			/>
		</div>
	);
};

const VersionItemList = ({
	children,
}: {
	children: React.ReactNode[] | null;
}) => {
	return <div className={styles.versionList}>{children}</div>;
};

export const VersionCheckoutWindow = ({
	onClose,
	children,
}: VersionCheckoutWindowParams) => {
	return (
		<Drawer title="Версии" onClose={onClose}>
			<VersionItemList>{children}</VersionItemList>
		</Drawer>
	);
};
