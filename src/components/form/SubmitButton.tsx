import { Button } from "@heroui/react";

interface SubmitButtonProps {
	label: string;
}

export const SubmitButton = ({ label }: SubmitButtonProps) => {
	return (
		<Button type="submit" className="w-full">
			{label}
		</Button>
	);
};
