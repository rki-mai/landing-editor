import { ErrorMessage as HeroErrorMessage } from "@heroui/react";

export const ErrorMessage = ({ error }: { error: string }) => {
	return (
		<div className="text-center">
			<HeroErrorMessage>{error}</HeroErrorMessage>
		</div>
	);
};
