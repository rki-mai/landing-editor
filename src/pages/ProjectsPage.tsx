import { useState } from "react";
import {
	ApiClient,
	TokenProviderError,
	Unauthorized,
} from "../components/apiClient";
import { runBackgroundTask } from "../components/backgroundTask";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import { ProjectsList } from "../components/ProjectsList";
import { ProjectsMenu } from "../components/ProjectsMenu";
import { Tabs } from "../components/Tabs";
import styles from "./ProjectsPage.module.css";

interface ProjectInfo {
	id: string;
	name: string;
}

const getProjects = async (apiClient: ApiClient): Promise<ProjectInfo[]> => {
	const projectIds = await apiClient.getProjects();
	return projectIds.map((id, index) => ({ id, name: `Проект ${index + 1}` }));
};

export default function ProjectsPage() {
	const tokenProvider = new LocalStorageTokenProvider(
		new ApiClient({ baseUrl: "" }),
	);

	const apiClient = new ApiClient({
		baseUrl: "",
		tokenProvider,
	});

	const [projects, setProjects] = useState<ProjectInfo[] | null>(null);
	const [filteredProjects, setFilteredProjects] = useState<
		ProjectInfo[] | null
	>(null);

	runBackgroundTask("fetchProjects", async () => {
		try {
			const projects = await getProjects(apiClient);
			setProjects(projects);
			setFilteredProjects(projects);
		} catch (err) {
			if (err instanceof TokenProviderError || err instanceof Unauthorized) {
				tokenProvider.clearCredentials();
				window.location.href = "/login";
			}
		}
	});

	const handleCreate = () => {
		runBackgroundTask("createProject", async () => {
			try {
				const { project_id } = await apiClient.createProject();
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

	const handleOpen = (project: ProjectInfo) => {
		window.location.href = `/edit?projectId=${project.id}`;
	};

	return (
		<div className={styles.container}>
			<Tabs active="projects" />
			<div className={styles.content}>
				<div className={styles.menu}>
					<ProjectsMenu onCreate={handleCreate} onSearch={handleSearch} />
				</div>
				<ProjectsList projects={filteredProjects} onOpen={handleOpen} />
			</div>
		</div>
	);
}
