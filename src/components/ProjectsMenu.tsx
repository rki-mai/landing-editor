import { Plus } from "@gravity-ui/icons";
import { Button, SearchField } from "@heroui/react";

interface ProjectsMenuProps {
	onCreate: () => void;
	onSearch?: (query: string) => void;
}

interface SearchBarProps {
	onChange?: (query: string) => void;
}

interface CreateProjectButtonProps {
	onCreate: () => void;
}

const SearchBar = ({ onChange }: SearchBarProps) => {
	return (
		<div className="flex grow">
			<SearchField
				fullWidth
				name="search"
				variant="secondary"
				onChange={onChange}
			>
				<SearchField.Group>
					<SearchField.SearchIcon />
					<SearchField.Input placeholder="Поиск..." />
					<SearchField.ClearButton />
				</SearchField.Group>
			</SearchField>
		</div>
	);
};

const CreateProjectButton = ({ onCreate }: CreateProjectButtonProps) => {
	return (
		<div className="flex grow-0">
			<Button variant="primary" onClick={onCreate}>
				<Plus />
				Создать
			</Button>
		</div>
	);
};

export const ProjectsMenu = ({ onCreate, onSearch }: ProjectsMenuProps) => {
	return (
		<div className="flex gap-4 grow-1">
			<SearchBar onChange={onSearch} />
			<CreateProjectButton onCreate={onCreate} />
		</div>
	);
};
