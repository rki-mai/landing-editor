import { ArrowLeft } from "@gravity-ui/icons";
import { SquareButton } from "./squareButton";

export const MoveBackButton = () => {
	const onClick = () => {
		window.location.pathname = "/projects";
		return;
	};

	return (
		<SquareButton onClick={onClick}>
			<ArrowLeft />
		</SquareButton>
	);
};
