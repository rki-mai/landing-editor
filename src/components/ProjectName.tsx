import { Spinner } from "@heroui/react";
import type { ApiClient } from "./apiClient";

export const getProjectName = async (
	projectId: string,
	apiClient: ApiClient,
) => {
	const projects = await apiClient.getProjects();

	for (const project of projects.projects || []) {
		if (project.id === projectId) {
			return project.name;
		}
	}

	throw new Error("Unable to find project");
};

export const ProjectName = ({
	projectName,
}: {
	projectName: string | null;
}) => {
	if (projectName === null) {
		return <Spinner size="sm" />;
	}

	return <span className="font-bold">{projectName}</span>;
};
