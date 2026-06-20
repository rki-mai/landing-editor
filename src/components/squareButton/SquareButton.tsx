import { Button } from "@heroui/react";

type SquareButtonVariant = "primary" | "ghost" | "danger" | "success";

type SquareButtonProps = {
	children: React.ReactElement;
	variant?: SquareButtonVariant;
	size?: number;
	onClick?: () => void;
	"aria-label"?: string;
};

export const SquareButton = ({ children, onClick }: SquareButtonProps) => {
	return (
		<Button
			isIconOnly
			className="rounded-full"
			onClick={onClick}
			variant="tertiary"
		>
			{children}
		</Button>
	);
};
