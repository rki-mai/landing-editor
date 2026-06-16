import { useState } from "react";
import {
	ApiClient,
	TokenProviderError,
	Unauthorized,
	type Project,
	type Projects,
} from "../components/apiClient";
import { runBackgroundTask } from "../components/backgroundTask";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import { ProjectsList } from "../components/ProjectsList";
import { ProjectsMenu } from "../components/ProjectsMenu";
import { Tabs } from "../components/Tabs";
import styles from "./ProjectsPage.module.css";

const getProjects = async (apiClient: ApiClient): Promise<Projects> => {
	return await apiClient.getProjects();
};

export default function ProjectsPage() {
	const tokenProvider = new LocalStorageTokenProvider(
		new ApiClient({ baseUrl: "" }),
	);

	const apiClient = new ApiClient({
		baseUrl: "",
		tokenProvider,
	});

	const [projects, setProjects] = useState<Project[] | null>(null);
	const [filteredProjects, setFilteredProjects] = useState<Project[] | null>(
		null,
	);

	runBackgroundTask("fetchProjects", async () => {
		try {
			const projects = await getProjects(apiClient);
			setProjects(projects.projects);
			setFilteredProjects(projects.projects);
		} catch (err) {
			if (err instanceof TokenProviderError || err instanceof Unauthorized) {
				tokenProvider.clearCredentials();
				window.location.href = "/login";
			} else {
				throw err;
			}
		}
	});

	const handleCreate = () => {
		runBackgroundTask("createProject", async () => {
			try {
				const projectNumber = projects === null ? 1 : projects.length + 1;
				const projectName = `Проект ${projectNumber}`;
				const { project_id } = await apiClient.createProject(projectName);
				window.location.href = `/edit?projectId=${project_id}`;
			} catch (err) {
				if (err instanceof TokenProviderError || err instanceof Unauthorized) {
					tokenProvider.clearCredentials();
					window.location.href = "/login";
				}
			}
		});
	};

	const handleSearch = (query: string) => {
		if (!projects) return;
		const lowerQuery = query.toLowerCase();
		const filtered = projects.filter((project) =>
			project.name.toLowerCase().includes(lowerQuery),
		);
		setFilteredProjects(filtered);
	};

	const handlePublish = (project: Project) => {
		runBackgroundTask(
			`publishProject-${project.id}-${crypto.randomUUID()}`,
			async () => {
				try {
					await apiClient.createPublication(project.id);
					window.location.href = "/publications";
				} catch (err) {
					if (
						err instanceof TokenProviderError ||
						err instanceof Unauthorized
					) {
						tokenProvider.clearCredentials();
						window.location.href = "/login";
					} else {
						console.error("Failed to publish project", err);
					}
				}
			},
		);
	};

	const handleOpen = (project: Project) => {
		window.location.href = `/edit?projectId=${project.id}`;
	};

	return (
		<div className={styles.container}>
			<Tabs active="projects" />
			<div className={styles.content}>
				<div className={styles.menu}>
					<ProjectsMenu onCreate={handleCreate} onSearch={handleSearch} />
				</div>
				<ProjectsList
					projects={filteredProjects}
					onOpen={handleOpen}
					onPublish={handlePublish}
				/>
			</div>
		</div>
	);
}
