import { ChevronDown, ChevronUp, Gear, TrashBin } from "@gravity-ui/icons";
import { ActionMenuItem } from "./edit_area";
import type { LandingElement } from "./types";

interface EditorActionProps {
	element: LandingElement | null;
	handler: (element: LandingElement) => void;
}

export const OpenSettingsAction = ({ element, handler }: EditorActionProps) => {
	const isDisabled = element === null;
	const onClick = isDisabled ? () => null : () => handler(element);

	return (
		<ActionMenuItem isDisabled={isDisabled} onClick={onClick} iconOnly={true}>
			<Gear />
		</ActionMenuItem>
	);
};

export const DeleteElementAction = ({
	element,
	handler,
}: EditorActionProps) => {
	const isDisabled = element === null;
	const onClick = isDisabled ? () => null : () => handler(element);

	return (
		<ActionMenuItem isDisabled={isDisabled} onClick={onClick} iconOnly={true}>
			<TrashBin />
		</ActionMenuItem>
	);
};

export const MoveUpAction = ({ element, handler }: EditorActionProps) => {
	const isDisabled = element === null;
	const onClick = isDisabled ? () => null : () => handler(element);

	return (
		<ActionMenuItem isDisabled={isDisabled} onClick={onClick} iconOnly={true}>
			<ChevronUp />
		</ActionMenuItem>
	);
};

export const MoveDownAction = ({ element, handler }: EditorActionProps) => {
	const isDisabled = element === null;
	const onClick = isDisabled ? () => null : () => handler(element);

	return (
		<ActionMenuItem isDisabled={isDisabled} onClick={onClick} iconOnly={true}>
			<ChevronDown />
		</ActionMenuItem>
	);
};
