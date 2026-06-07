import {
	ApiClient,
	type ITokenProvider,
	type LoginResponse,
	TokenProviderError,
} from "./apiClient";

export class LocalStorageTokenProvider implements ITokenProvider {
	private static readonly ACCESS_TOKEN_KEY = "wb_landing_editor.access_token";
	private static readonly REFRESH_TOKEN_KEY = "wb_landing_editor.refresh_token";
	private apiClient: ApiClient;

	constructor(apiClient: ApiClient) {
		this.apiClient = apiClient;
	}

	public getToken(): string {
		console.log("[LocalStorageTokenProvider] Get token from localStorage");
		const token = localStorage.getItem(
			LocalStorageTokenProvider.ACCESS_TOKEN_KEY,
		);

		if (!token) {
			throw new TokenProviderError("No access token found");
		}

		return token;
	}

	public async refreshToken(): Promise<void> {
		console.log("[LocalStorageTokenProvider] Refreshing token");
		const refreshToken = localStorage.getItem(
			LocalStorageTokenProvider.REFRESH_TOKEN_KEY,
		);

		if (!refreshToken) {
			throw new TokenProviderError("No refresh token found");
		}

		const newCredentials =
			await this.apiClient.refreshAccessToken(refreshToken);
		this.saveCredentials(newCredentials);
	}

	public saveCredentials(credentials: LoginResponse): void {
		localStorage.setItem(
			LocalStorageTokenProvider.ACCESS_TOKEN_KEY,
			credentials.access_token,
		);

		localStorage.setItem(
			LocalStorageTokenProvider.REFRESH_TOKEN_KEY,
			credentials.refresh_token,
		);

		console.log(
			"[LocalStorageTokenProvider] Credentials saved to localStorage",
		);
	}
}
