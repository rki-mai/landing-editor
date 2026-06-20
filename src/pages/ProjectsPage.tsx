import { useState } from "react";
import {
	ApiClient,
	type Project,
	type Projects,
	TokenProviderError,
	Unauthorized,
} from "../components/apiClient";
import { runBackgroundTask } from "../components/backgroundTask";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import { ProjectsList } from "../components/ProjectsList";
import { ProjectsMenu } from "../components/ProjectsMenu";
import { Tab, Tabs } from "../components/Tabs";
import styles from "./ProjectsPage.module.css";
import { UserMenu } from "../components/UserMenu";
import { PageContent, PageHeader, PageLayout } from "../components/PageLayout";

const getProjects = async (apiClient: ApiClient): Promise<Projects> => {
	return await apiClient.getProjects();
};

function redirectOnLogin<T>(
	tokenProvider: LocalStorageTokenProvider,
	func: () => Promise<T>,
): () => Promise<T> {
	return async () => {
		try {
			return await func();
		} catch (err) {
			if (err instanceof TokenProviderError || err instanceof Unauthorized) {
				tokenProvider.clearCredentials();
				window.location.href = "/login";
				throw Error("Redirect");
			} else {
				throw err;
			}
		}
	};
}

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

	runBackgroundTask(
		"fetchProjects",
		redirectOnLogin(tokenProvider, async () => {
			const projects = await getProjects(apiClient);
			const processedProjects = projects.projects || [];
			setProjects(processedProjects);
			setFilteredProjects(processedProjects);
		}),
	);

	const handleCreate = () => {
		runBackgroundTask(
			"createProject",
			redirectOnLogin(tokenProvider, async () => {
				const projectNumber = projects === null ? 1 : projects.length + 1;
				const projectName = `Проект ${projectNumber}`;
				const { project_id } = await apiClient.createProject(projectName);
				window.location.href = `/edit?projectId=${project_id}`;
			}),
		);
	};

	const renameProject = (project: Project, name: string) => {
		runBackgroundTask(
			"renameProject",
			redirectOnLogin(tokenProvider, async () => {
				await apiClient.updateProject(project.id, { name: name });
				window.location.reload();
			}),
		);
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

	const handleViewVersions = (project: Project) => {
		window.location.href = `/projects/${project.id}/versions`;
	};

	return (
		<PageLayout>
			<PageHeader>
				<div className="grow">
					<Tabs>
						<Tab
							title="Проекты"
							id="projects"
							href="/projects"
							isSelected={true}
						/>
						<Tab
							title="Публикации"
							id="publications"
							href="/publications"
							isSelected={false}
						/>
					</Tabs>
				</div>
				<div className="flex grow-0 items-center">
					<UserMenu tokenProvider={tokenProvider} />
				</div>
			</PageHeader>
			<PageContent>
				<div className={styles.menu}>
					<ProjectsMenu onCreate={handleCreate} onSearch={handleSearch} />
				</div>
				<ProjectsList
					projects={filteredProjects}
					onOpen={handleOpen}
					onPublish={handlePublish}
					onRename={renameProject}
					onViewVersions={handleViewVersions}
				/>
			</PageContent>
		</PageLayout>
	);
}
