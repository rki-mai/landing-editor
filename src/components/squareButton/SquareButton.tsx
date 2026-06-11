import styles from "./SquareButton.module.css";

type SquareButtonVariant = "primary" | "ghost" | "danger" | "success";

type SquareButtonProps = {
	icon: string;
	variant?: SquareButtonVariant;
	size?: number;
	onClick?: () => void;
	"aria-label"?: string;
};

export const SquareButton = ({
	icon,
	variant = "primary",
	size = 48,
	onClick,
}: SquareButtonProps) => {
	return (
		<button
			className={`${styles.btn} ${styles[variant]}`}
			style={{ width: size, height: size }}
			onClick={onClick}
		>
			<img src={icon} alt="" />
		</button>
	);
};
