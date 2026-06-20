import { ArrowUturnCcwLeft } from "@gravity-ui/icons";
import { Drawer } from "../drawer";
import { SquareButton } from "../squareButton";
import styles from "./versionCheckout.module.css";

interface VersionCheckoutWindowParams {
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
	const baseStyles = "flex p-2 gap-2 border border-2 rounded-4xl";
	const activeStyles = "bg-[rgba(225,213,240,1)] border-[var(--accent)]";
	const notActiveStyles = "border-transparent";
	const itemStyles = `${baseStyles} ${active ? activeStyles : notActiveStyles}`;

	return (
		<div className={itemStyles} onClick={active ? undefined : onView}>
			<div className="flex items-center grow">Версия {versionNumber}</div>
			<div className="flex items-center justify-center grow-0">
				{onCheckout && (
					<SquareButton onClick={onCheckout}>
						<ArrowUturnCcwLeft />
					</SquareButton>
				)}
			</div>
		</div>
	);
};

const VersionItemList = ({
	children,
}: {
	children: React.ReactNode[] | null;
}) => {
	return (
		<div className={`flex-1 overflow-y-auto ${styles.versionList}`}>
			{children}
		</div>
	);
};

export const VersionCheckoutWindow = ({
	children,
}: VersionCheckoutWindowParams) => {
	return (
		<Drawer title="Версии">
			<VersionItemList>{children}</VersionItemList>
		</Drawer>
	);
};
