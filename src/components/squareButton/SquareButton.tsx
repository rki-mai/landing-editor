import { Button } from "@heroui/react";

type SquareButtonProps = {
	children: React.ReactElement;
	onClick?: () => void;
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
