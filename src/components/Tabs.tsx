import styles from "./Tabs.module.css";

interface TabsProps {
	active?: "projects" | "publications" | string;
}

export const Tabs = ({ active = "projects" }: TabsProps) => {
	return (
		<header className={styles.header}>
			<nav className={styles.tabs}>
				<div
					className={`${styles.tab} ${active === "projects" ? styles.active : ""}`}
					onClick={() => {
						window.location.href = "/projects";
					}}
				>
					Проекты
				</div>
				<div
					className={`${styles.tab} ${active === "publications" ? styles.active : ""}`}
					onClick={() => {
						window.location.href = "/publications";
					}}
				>
					Публикации
				</div>
			</nav>
		</header>
	);
};
