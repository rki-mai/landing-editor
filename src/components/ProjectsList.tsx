import styles from "./ProjectsList.module.css";

interface ProjectInfo {
	id: string;
	name: string;
}

export interface ProjectsListProps {
	projects: ProjectInfo[] | null;
	onOpen: (project: ProjectInfo) => void;
}

export function ProjectsList({ projects, onOpen }: ProjectsListProps) {
	return (
		<section className={styles.list}>
			{projects === null ? (
				<div className={styles.empty}>Загрузка ...</div>
			) : projects.length === 0 ? (
				<div className={styles.empty}>Нет проектов</div>
			) : (
				<ul className={styles.ul}>
					{projects.map((project) => (
						<li key={project.id} className={styles.item}>
							<a
								href={`/edit?projectId=${project.id}`}
								className={styles.link}
								onClick={(e) => {
									e.preventDefault();
									onOpen(project);
								}}
							>
								{project.name}
							</a>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
