import { z } from "zod";

export class TokenProviderError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "TokenProviderError";
	}
}

export interface ITokenProvider {
	getToken(): string | null;
	refreshToken(): Promise<void>;
}

export interface ApiClientConfig {
	baseUrl: string;
	tokenProvider?: ITokenProvider;
}

interface UpdateObject extends Record<string, UpdateValue> {}
type UpdateValue = string | number | UpdateObject;

export interface Credentials {
	email: string;
	password: string;
}

export interface CreateOperation {
	operation: "create";
	data: DraftElement;
}

export interface UpdateData {
	id: string;
	fields: Record<string, UpdateValue>;
}

export interface UpdateOperation {
	operation: "update";
	data: UpdateData;
}

export interface DeleteData {
	id: string;
}

export interface DeleteOperation {
	operation: "delete";
	data: DeleteData;
}

export type Operation = CreateOperation | UpdateOperation | DeleteOperation;

const ElementStylesSchema = z.record(z.string(), z.string());

const BaseElementSchema = z
	.object({
		id: z.string(),
		parentId: z.string(),
		index: z.number(),
	})
	.strip();

const TextElementSchema = BaseElementSchema.extend({
	element: z.literal("text"),
	value: z.string(),
	styles: z.optional(ElementStylesSchema),
}).strip();

const ContainerElementSchema = BaseElementSchema.extend({
	element: z.literal("container"),
}).strip();

const LinkElementSchema = BaseElementSchema.extend({
	element: z.literal("link"),
	value: z.string(),
	src: z.string(),
	styles: z.optional(ElementStylesSchema),
}).strip();

const ImageElementSchema = BaseElementSchema.extend({
	element: z.literal("image"),
	value: z.string(),
	alt: z.optional(z.string()),
	styles: z.optional(ElementStylesSchema),
}).strip();

const ButtonElementSchema = BaseElementSchema.extend({
	element: z.literal("button"),
	value: z.string(),
	src: z.string(),
	styles: z.optional(ElementStylesSchema),
}).strip();

const LandingElementSchema = z.discriminatedUnion("element", [
	TextElementSchema,
	ContainerElementSchema,
	LinkElementSchema,
	ImageElementSchema,
	ButtonElementSchema,
]);

const DraftSchema = z
	.object({ elements: z.array(LandingElementSchema) })
	.strip();

export type DraftElement = z.infer<typeof LandingElementSchema>;
export type Draft = z.output<typeof DraftSchema>;

const LoginResponseSchema = z
	.object({
		access_token: z.string(),
		refresh_token: z.string(),
	})
	.strip();

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

const RegisterResponseSchema = z
	.object({
		email: z.string(),
		id: z.string(),
	})
	.strip();

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

const CreateProjectResponseSchema = z
	.object({
		project_id: z.string(),
	})
	.strip();

export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

const ProjectSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.strip();
export type Project = z.infer<typeof ProjectSchema>;

const ProjectsSchema = z.object({ projects: z.array(ProjectSchema) }).strip();
export type Projects = z.infer<typeof ProjectsSchema>;

const PublicationIdsResponseSchema = z
	.object({ ids: z.array(z.string()) })
	.strip();

const PublicationStatusSchema = z.enum([
	"PENDING",
	"PROCESSING",
	"FINISHED",
	"FAILED",
]);
export type PublicationStatus = z.infer<typeof PublicationStatusSchema>;

const PublicationSchema = z
	.object({
		status: PublicationStatusSchema,
		created_at: z.string(),
		public_url: z.string().optional(),
	})
	.strip();
export type Publication = z.infer<typeof PublicationSchema>;

const CreatePublicationResponseSchema = z.object({ id: z.string() }).strip();

export class HttpError extends Error {
	public path: string;
	public statusCode: number;
	public details: string;

	constructor(path: string, statusCode: number, details: string) {
		super(`Call '${path}' finished with status code ${statusCode}: ${details}`);
		this.path = path;
		this.statusCode = statusCode;
		this.details = details;
		this.name = "HttpError";
	}
}

export class Unauthorized extends Error {
	constructor(message: string = "Unauthorized") {
		super(message);
		this.name = "Unauthorized";
	}
}

export class UserAlreadyExists extends Error {
	constructor(message: string = "User with this email already exists") {
		super(message);
		this.name = "UserAlreadyExists";
	}
}

export class ProjectNotFound extends Error {
	constructor(message: string = "Project not found") {
		super(message);
		this.name = "ProjectNotFound";
	}
}

export class ApiClient {
	private baseUrl: string;
	private tokenProvider: ITokenProvider | null;

	constructor(config: ApiClientConfig) {
		this.baseUrl = config.baseUrl;
		this.tokenProvider = config.tokenProvider || null;
	}

	public async getDraft(projectId: string): Promise<Draft> {
		try {
			const data = await this.sendAuthorizedRequest(
				`/api/v1/projects/${projectId}/draft`,
				{ method: "GET" },
			);

			return await this.parseDraftResponse(data);
		} catch (err) {
			if (err instanceof HttpError && err.statusCode === 404) {
				throw new ProjectNotFound();
			}
			throw err;
		}
	}

	public async getPublicationIds(projectId: string): Promise<string[]> {
		try {
			const data = await this.sendAuthorizedRequest(
				`/api/v1/projects/${projectId}/publications`,
				{ method: "GET" },
			);

			return await this.parsePublicationIdsResponse(data);
		} catch (err) {
			if (err instanceof HttpError && err.statusCode === 404) {
				throw new ProjectNotFound();
			}
			throw err;
		}
	}

	public async getPublication(
		projectId: string,
		publicationId: string,
	): Promise<Publication> {
		try {
			const response = await this.sendAuthorizedRequest(
				`/api/v1/projects/${projectId}/publications/${publicationId}`,
				{ method: "GET" },
			);
			const data = await response.json();
			return await PublicationSchema.parseAsync(data);
		} catch (err) {
			if (err instanceof HttpError && err.statusCode === 404) {
				throw new ProjectNotFound();
			}
			throw err;
		}
	}

	public async createPublication(projectId: string): Promise<string> {
		try {
			const response = await this.sendAuthorizedRequest(
				`/api/v1/projects/${projectId}/publications`,
				{ method: "POST" },
			);
			const data = await response.json();
			const parsed = await CreatePublicationResponseSchema.parseAsync(data);
			return parsed.id;
		} catch (err) {
			if (err instanceof HttpError && err.statusCode === 404) {
				throw new ProjectNotFound();
			}
			throw err;
		}
	}

	public async deletePublication(
		projectId: string,
		publicationId: string,
	): Promise<void> {
		try {
			await this.sendAuthorizedRequest(
				`/api/v1/projects/${projectId}/publications/${publicationId}`,
				{ method: "DELETE" },
			);
		} catch (err) {
			if (err instanceof HttpError && err.statusCode === 404) {
				throw new ProjectNotFound();
			}
			throw err;
		}
	}

	public async login(credentials: Credentials): Promise<LoginResponse> {
		const response = await this.sendRequest("/api/v1/auth/login", {
			method: "POST",
			body: JSON.stringify(credentials),
		});
		const data = await this.parseLoginResponse(response);
		return data;
	}

	public async register(credentials: Credentials): Promise<RegisterResponse> {
		try {
			const response = await this.sendRequest("/api/v1/auth/register", {
				method: "POST",
				body: JSON.stringify(credentials),
			});
			const data = await this.parseRegisterResponse(response);
			return data;
		} catch (err) {
			if (err instanceof HttpError && err.statusCode === 409) {
				throw new UserAlreadyExists();
			}
			throw err;
		}
	}

	public async refreshAccessToken(
		refreshToken: string,
	): Promise<LoginResponse> {
		const response = await this.sendRequest("/api/v1/auth/refresh", {
			method: "POST",
			body: JSON.stringify({ refresh_token: refreshToken }),
		});
		const data = await this.parseLoginResponse(response);
		return data;
	}

	public async createProject(name: string): Promise<CreateProjectResponse> {
		const response = await this.sendAuthorizedRequest("/api/v1/projects", {
			method: "POST",
			body: JSON.stringify({ name: name }),
		});
		return await this.parseCreateProjectResponse(response);
	}

	public async updateDraft(
		projectId: string,
		operation: Operation,
	): Promise<void> {
		await this.sendAuthorizedRequest(
			`api/v1/projects/${projectId}/draft/mutations`,
			{
				method: "POST",
				body: JSON.stringify(operation),
			},
		);
	}

	public async getProjects(): Promise<Projects> {
		const response = await this.sendAuthorizedRequest(`api/v1/projects`, {
			method: "GET",
		});
		return await this.parseProjectsResponse(response);
	}

	private async sendRequest(
		endpoint: string,
		options: RequestInit = {},
	): Promise<Response> {
		const url = `${this.baseUrl}${endpoint}`;
		const headers = new Headers(options.headers);

		if (options.body && !(options.body instanceof FormData)) {
			if (!headers.has("Content-Type")) {
				headers.set("Content-Type", "application/json");
			}
		}

		const response = await fetch(url, {
			...options,
			headers,
		});

		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			if (response.status === 401) {
				throw new Unauthorized(errorBody);
			}
			throw new HttpError(url, response.status, errorBody);
		}

		return response;
	}

	private async sendAuthorizedRequest(
		endpoint: string,
		options: RequestInit,
	): Promise<Response> {
		try {
			const extendedOptions = this.extendRequestOptionsWithAuth(options);
			return await this.sendRequest(endpoint, extendedOptions);
		} catch (err) {
			if (err instanceof Unauthorized && this.tokenProvider) {
				await this.tokenProvider.refreshToken();

				const extendedOptions = this.extendRequestOptionsWithAuth(options);
				return await this.sendRequest(endpoint, extendedOptions);
			}
			throw err;
		}
	}

	private extendRequestOptionsWithAuth(options: RequestInit): RequestInit {
		const foo = {
			...options,
			headers: {
				...options.headers,
				...this.getAuthHeaders(),
			},
		};

		console.log("[ApiClient] Extended request options with auth", foo);

		return foo;
	}

	private getAuthHeaders(): HeadersInit {
		if (this.tokenProvider === null) {
			throw new Error("Token provider is not configured");
		}

		const token = this.tokenProvider.getToken();
		return {
			Authorization: `Bearer ${token}`,
		};
	}

	private async parseDraftResponse(response: Response): Promise<Draft> {
		const data = await response.json();
		return await DraftSchema.parseAsync(data);
	}

	private async parseLoginResponse(response: Response): Promise<LoginResponse> {
		const data = await response.json();
		return await LoginResponseSchema.parseAsync(data);
	}

	private async parseRegisterResponse(
		response: Response,
	): Promise<RegisterResponse> {
		const data = await response.json();
		return await RegisterResponseSchema.parseAsync(data);
	}

	private async parseCreateProjectResponse(
		response: Response,
	): Promise<CreateProjectResponse> {
		const data = await response.json();
		return await CreateProjectResponseSchema.parseAsync(data);
	}

	private async parsePublicationIdsResponse(
		response: Response,
	): Promise<string[]> {
		const data = await response.json();
		const parsed = await PublicationIdsResponseSchema.parseAsync(data);
		return parsed.ids;
	}

	private async parseProjectsResponse(response: Response): Promise<Projects> {
		const data = await response.json();
		return await ProjectsSchema.parseAsync(data);
	}
}
