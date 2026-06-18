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
	const activeClassName = active
		? styles.versionItemActive
		: styles.versionItemInactive;
	const className = `${styles.versionItem} ${activeClassName}`;

	return (
		<div className={className} onClick={active ? undefined : onView}>
			<div className={styles.versionName}>Версия {versionNumber}</div>
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
