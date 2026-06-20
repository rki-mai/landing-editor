import { Button, Dropdown, Label } from "@heroui/react";
import { Person, ArrowRightFromSquare } from "@gravity-ui/icons";
import type { LocalStorageTokenProvider } from "./localStorageTokenProvider";

interface UserMenuProps {
	tokenProvider: LocalStorageTokenProvider;
}

export const UserMenu = ({ tokenProvider }: UserMenuProps) => {
	const onClick = () => {
		tokenProvider.clearCredentials();
		window.location.pathname = "/login";
	};

	return (
		<Dropdown>
			<Button
				isIconOnly
				aria-label="Menu"
				className="rounded-full"
				variant="tertiary"
			>
				<Person className="outline-none" />
			</Button>

			<Dropdown.Popover>
				<Dropdown.Menu onAction={() => onClick()}>
					<Dropdown.Item id="logout" textValue="Выход" variant="danger">
						<div className="flex w-full items-center justify-between gap-2">
							<Label>Log Out</Label>
							<ArrowRightFromSquare className="size-3.5 text-danger" />
						</div>
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	);
};
