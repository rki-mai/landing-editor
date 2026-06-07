import { z } from "zod";

export interface ApiClientConfig {
	baseUrl: string;
	token?: string;
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

const DraftSchema = z.array(LandingElementSchema);
export type DraftElement = z.infer<typeof LandingElementSchema>;
export type Draft = z.output<typeof DraftSchema>;

const LoginResponseSchema = z
	.object({
		access_token: z.string(),
		refresh_token: z.string(),
	})
	.strip();

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

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

export class ApiClient {
	private baseUrl: string;
	private token: string | null;

	constructor(config: ApiClientConfig) {
		this.baseUrl = config.baseUrl;
		this.token = config.token || null;
	}

	public async getDraft(projectId: string): Promise<Draft> {
		const response = await this.sendRequest(`/api/v1/storage/${projectId}`, {
			method: "GET",
		});
		return await this.parseDraftResponse(response);
	}

	public async login(credentials: Credentials): Promise<LoginResponse> {
		const response = await this.sendRequest("/api/v1/auth/login", {
			method: "POST",
			body: JSON.stringify(credentials),
		});
		return await this.parseLoginResponse(response);
	}

	public async updateDraft(
		projectId: string,
		operation: Operation,
	): Promise<void> {
		await this.sendRequest(`api/v1/storage/${projectId}/mutations`, {
			method: "POST",
			body: JSON.stringify(operation),
		});
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

		if (this.token) {
			headers.set("Authorization", `Bearer ${this.token}`);
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

	private async parseDraftResponse(response: Response): Promise<Draft> {
		const data = await response.json();
		return await DraftSchema.parseAsync(data);
	}

	private async parseLoginResponse(response: Response): Promise<LoginResponse> {
		const data = await response.json();
		return await LoginResponseSchema.parseAsync(data);
	}
}
