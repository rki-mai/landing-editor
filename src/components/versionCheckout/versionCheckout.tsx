import eyeIcon from "../../assets/eye.svg";
import rotateIcon from "../../assets/rotate-left.svg";
import { Drawer } from "../drawer";
import { SquareButton } from "../squareButton";
import styles from "./versionCheckout.module.css";

interface VersionCheckoutWindowParams {
	onClose: () => void;
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

const VersionItemList = ({ children }: { children: React.ReactNode[] }) => {
	return <div className={styles.versionList}>{children}</div>;
};

export const VersionCheckoutWindow = ({
	onClose,
}: VersionCheckoutWindowParams) => {
	return (
		<Drawer title="Версии" onClose={onClose}>
			<VersionItemList>
				<VersionItem versionNumber={1} active={true} />
				<VersionItem versionNumber={2} active={false} />
				<VersionItem versionNumber={3} active={false} />
			</VersionItemList>
		</Drawer>
	);
};
