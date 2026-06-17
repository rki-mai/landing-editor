import { useState } from "react";
import {
	ApiClient,
	ProjectNotFound,
	TokenProviderError,
	Unauthorized,
} from "../components/apiClient";
import { runBackgroundTask } from "../components/backgroundTask";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import type { LandingPage } from "../components/types";
import { PreviewContainer } from "../components/edit_area";
import { PreviewCanvas } from "../components/preview_canvas";
import { renderElements } from "../components/editor_components_renderer";
import {
	VersionCheckoutWindow,
	VersionItem,
} from "../components/versionCheckout/versionCheckout";
import { useParams } from "react-router-dom";

export const VersionExplorerPage = () => {
	const { projectId } = useParams();

	const [apiClient, tokenProvider] = createApiClient();
	const [snapshot, setSnapshot] = useState<LandingPage | null>(null);
	const [versions, setVersions] = useState<number[] | null>(null);

	if (!projectId) {
		window.location.pathname = "/login";
		return;
	}

	runBackgroundTask(
		"initializePage",
		redirectOnFallbackPages(tokenProvider, async () => {
			loadVersionSnapshot(
				tokenProvider,
				apiClient,
				projectId,
				null,
				(snapshot) => {
					setSnapshot(snapshot);
					setVersions(createInitialVersionsInfo(snapshot.version));
				},
			);
		}),
	);

	return (
		<div className="app-container">
			<div className="editor-container">
				<PreviewContainer>
					<PreviewCanvas>
						{snapshot &&
							renderElements(
								snapshot.elements,
								() => null,
								() => null,
								() => null,
							)}
					</PreviewCanvas>
				</PreviewContainer>
				<VersionCheckoutWindow onClose={() => null}>
					{versions &&
						versions.map((version) => (
							<VersionItem
								versionNumber={version}
								active={version === snapshot?.version}
								onView={() =>
									loadVersionSnapshot(
										tokenProvider,
										apiClient,
										projectId,
										version,
										setSnapshot,
									)
								}
								onCheckout={() =>
									restoreVersion(
										tokenProvider,
										apiClient,
										projectId,
										Math.max(...versions),
										version,
									)
								}
							/>
						))}
				</VersionCheckoutWindow>
			</div>
		</div>
	);
};

const restoreVersion = (
	tokenProvider: LocalStorageTokenProvider,
	apiClient: ApiClient,
	projectId: string,
	latestVersion: number,
	currentVersion: number,
) => {
	runBackgroundTask(
		`restoreVersion-${currentVersion}-${crypto.randomUUID()}`,
		redirectOnFallbackPages(tokenProvider, async () => {
			const revertsCount = latestVersion - currentVersion;
			await apiClient.updateDraft(projectId, {
				operation: "revert",
				data: { count: revertsCount },
			});
			window.location.reload();
		}),
	);
};

const loadVersionSnapshot = (
	tokenProvider: LocalStorageTokenProvider,
	apiClient: ApiClient,
	projectId: string,
	version: number | null,
	onLoaded: (snapshot: LandingPage) => void,
) => {
	runBackgroundTask(
		`loadVersionSnapshot-${version}-${crypto.randomUUID()}`,
		redirectOnFallbackPages(tokenProvider, async () => {
			onLoaded(await apiClient.getDraft(projectId, version));
		}),
	);
};

function redirectOnFallbackPages<R>(
	tokenProvider: LocalStorageTokenProvider,
	func: () => Promise<R>,
) {
	return async () => {
		try {
			return await func();
		} catch (err) {
			if (err instanceof TokenProviderError || err instanceof Unauthorized) {
				tokenProvider.clearCredentials();
				window.location.href = "/login";
				return;
			}

			if (err instanceof ProjectNotFound) {
				window.location.href = "/projects";
				return;
			}
		}
	};
}

const createInitialVersionsInfo = (latestVersion: number) => {
	const versions: number[] = [];

	for (let versionNumber = 0; versionNumber <= latestVersion; versionNumber++) {
		versions.push(versionNumber);
	}

	return versions;
};

const createApiClient = () => {
	const tokenProvider = new LocalStorageTokenProvider(
		new ApiClient({ baseUrl: "" }),
	);

	const apiClient = new ApiClient({
		baseUrl: "",
		tokenProvider,
	});

	return [apiClient, tokenProvider] as const;
};
