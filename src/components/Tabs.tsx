import styles from "./Tabs.module.css";

interface TabsProps {
	active?: "projects" | string;
}

export const Tabs = ({ active = "projects" }: TabsProps) => {
	return (
		<header className={styles.header}>
			<nav className={styles.tabs}>
				<div
					className={`${styles.tab} ${active === "projects" ? styles.active : ""}`}
				>
					Проекты
				</div>
			</nav>
		</header>
	);
};
