import commitIcon from "../assets/commit.svg";
import paperPlaneIcon from "../assets/paper-plane.svg";
import pencilIcon from "../assets/pencil.svg";
import type { Project } from "./apiClient";
import styles from "./ProjectsList.module.css";
import { SquareButton } from "./squareButton";

export interface ProjectsListProps {
	projects: Project[] | null;
	onOpen: (project: Project) => void;
	onPublish: (project: Project) => void;
	onRename: (project: Project, name: string) => void;
	onViewVersions: (project: Project) => void;
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

const RenameButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<SquareButton
			icon={pencilIcon}
			size={30}
			variant="ghost"
			onClick={onClick}
		></SquareButton>
	);
};

const ViewVersionsButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<SquareButton
			icon={commitIcon}
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
	onRename,
	onViewVersions,
}: {
	project: Project;
	onOpen: (project: Project) => void;
	onPublish: (project: Project) => void;
	onRename: (project: Project, name: string) => void;
	onViewVersions: (project: Project) => void;
}) => {
	const handleRenameProject = () => {
		const inputValue = prompt("Название проекта:");
		if (inputValue !== null) {
			onRename(project, inputValue);
		}
	};

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
				<RenameButton onClick={handleRenameProject} />
				<ViewVersionsButton onClick={() => onViewVersions(project)} />
				<PublishButton onClick={() => onPublish(project)} />
			</div>
		</li>
	);
};

export function ProjectsList({
	projects,
	onOpen,
	onPublish,
	onRename,
	onViewVersions,
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
								onRename={onRename}
								onViewVersions={onViewVersions}
							/>
						))}
					</ul>
				</>
			)}
		</section>
	);
}
