import { useState } from "react";
import styles from "./ProjectsMenu.module.css";

interface ProjectsMenuProps {
	onCreate: () => void;
	onSearch?: (query: string) => void;
}

export const ProjectsMenu = ({ onCreate, onSearch }: ProjectsMenuProps) => {
	const [query, setQuery] = useState("");

	return (
		<div className={styles.menu}>
			<input
				className={styles.search}
				placeholder="Поиск..."
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					if (onSearch) onSearch(e.target.value);
				}}
			/>
			<button className={styles.create} onClick={onCreate}>
				Создать проект
			</button>
		</div>
	);
};
