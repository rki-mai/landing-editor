import { CodeCommitHorizontal, PaperPlane, Pencil } from "@gravity-ui/icons";
import {
	Button,
	Input,
	Label,
	Modal,
	Spinner,
	Surface,
	TextField,
} from "@heroui/react";
import { useState } from "react";
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
		<SquareButton onClick={onClick}>
			<PaperPlane />
		</SquareButton>
	);
};

const RenameButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<SquareButton onClick={onClick}>
			<Pencil />
		</SquareButton>
	);
};

const ViewVersionsButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<SquareButton onClick={onClick}>
			<CodeCommitHorizontal />
		</SquareButton>
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
	const [projectName, setProjectName] = useState<string | null>(null);

	const handleRenameProject = () => {
		if (projectName === null) {
			console.warn("Empty project name");
			return;
		}

		onRename(project, projectName);
	};

	return (
		<Surface variant="default" className="rounded-4xl p-4 flex gap-4">
			<div className="flex items-center grow">
				<Label
					className="hover:underline cursor-pointer"
					onClick={() => onOpen(project)}
				>
					{project.name}
				</Label>
			</div>
			<div className="flex items-center gap-4 grow-0">
				<Modal>
					<RenameButton onClick={handleRenameProject} />
					<Modal.Backdrop>
						<Modal.Container placement="auto">
							<Modal.Dialog className="sm:max-w-md">
								<Modal.CloseTrigger className="rounded-full" />
								<Modal.Header>
									<Modal.Heading>Название проекта</Modal.Heading>
									<p className="mt-1.5 text-sm leading-5 text-muted">
										Укажите новое название проекта и нажмите кнопку ниже
									</p>
								</Modal.Header>
								<Modal.Body>
									<Surface variant="default">
										<form className="flex flex-col gap-4">
											<TextField
												aria-label="projectName"
												className="w-full"
												name="name"
												type="text"
												variant="secondary"
												onChange={setProjectName}
											>
												<Input placeholder="Название проекта..." />
											</TextField>
										</form>
									</Surface>
								</Modal.Body>
								<Modal.Footer>
									<Button
										slot="close"
										variant="tertiary"
										onClick={() => setProjectName(null)}
									>
										Отмена
									</Button>
									<Button onClick={handleRenameProject} slot="close">
										Переименовать
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
				<ViewVersionsButton onClick={() => onViewVersions(project)} />
				<PublishButton onClick={() => onPublish(project)} />
			</div>
		</Surface>
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
		<div className="flex flex-col grow gap-4">
			{projects === null ? (
				<div className="flex flex-col items-center gap-2 grow">
					<Spinner size="xl" />
					<span className="text-xs text-muted">Загрузка ...</span>
				</div>
			) : projects.length === 0 ? (
				<div className={styles.empty}>Нет проектов</div>
			) : (
				projects.map((project) => {
					return (
						<ProjectListItem
							key={project.id}
							project={project}
							onOpen={onOpen}
							onPublish={onPublish}
							onRename={onRename}
							onViewVersions={onViewVersions}
						/>
					);
				})
			)}
		</div>
	);
}
