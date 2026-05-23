import { z } from "zod";

export interface ApiClientConfig {
	baseUrl: string;
	token?: string;
}

export interface TextElement {
	element: "text";
	value: string;
	id: string;
	parentId: string;
	styles?: Record<string, string>;
}

interface UpdateObject extends Record<string, UpdateValue> {}
type UpdateValue = string | number | UpdateObject;

export interface CreateOperation {
	operation: "create";
	data: TextElement;
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

const BaseElementSchema = z
	.object({
		id: z.string(),
		parentId: z.string(),
		index: z.number(),
		version: z.number(),
	})
	.strip();

const TextElementSchema = BaseElementSchema.extend({
	element: z.literal("text"),
	value: z.string(),
	styles: z.optional(z.record(z.string(), z.string())),
}).strip();

const LandingElementSchema = z.discriminatedUnion("element", [
	TextElementSchema,
]);

const DraftSchema = z.array(LandingElementSchema);
export type DraftElement = z.infer<typeof LandingElementSchema>;
export type Draft = z.output<typeof DraftSchema>;

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
			throw new HttpError(url, response.status, errorBody);
		}

		return response;
	}

	private async parseDraftResponse(response: Response): Promise<Draft> {
		const data = await response.json();
		return await DraftSchema.parseAsync(data);
	}
}
