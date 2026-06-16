import paperPlaneIcon from "../assets/paper-plane.svg";
import type { Project } from "./apiClient";
import styles from "./ProjectsList.module.css";
import { SquareButton } from "./squareButton";

export interface ProjectsListProps {
	projects: Project[] | null;
	onOpen: (project: Project) => void;
	onPublish: (project: Project) => void;
}

const PublishButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<SquareButton
			icon={paperPlaneIcon}
			size={30}
			variant="ghost"
			onClick={onClick}
		></SquareButton>
	);
};

const ProjectListItem = ({
	project,
	onOpen,
	onPublish,
}: {
	project: Project;
	onOpen: (project: Project) => void;
	onPublish: (project: Project) => void;
}) => {
	return (
		<li key={project.id} className={styles.item}>
			<div className={styles.itemContent}>
				<a
					href={`/edit?projectId=${project.id}`}
					className={`${styles.link} ${styles.itemName}`}
					onClick={(e) => {
						e.preventDefault();
						onOpen(project);
					}}
				>
					{project.name}
				</a>
				<PublishButton onClick={() => onPublish(project)} />
			</div>
		</li>
	);
};

export function ProjectsList({
	projects,
	onOpen,
	onPublish,
}: ProjectsListProps) {
	return (
		<section className={styles.list}>
			{projects === null ? (
				<div className={styles.empty}>Загрузка ...</div>
			) : projects.length === 0 ? (
				<div className={styles.empty}>Нет проектов</div>
			) : (
				<>
					<ul className={styles.ul}>
						{projects.map((project) => (
							<ProjectListItem
								key={project.id}
								project={project}
								onOpen={onOpen}
								onPublish={onPublish}
							/>
						))}
					</ul>
				</>
			)}
		</section>
	);
}
