import { z } from "zod";
import { type LandingPage } from "./types";

const BaseElementSchema = z.object({
	id: z.string(),
	parentId: z.string(),
	index: z.number(),
});

const TextElementStylesSchema = z.object({
	color: z.string().optional(),
	fontSize: z.coerce.number().optional(),
});

const TextElementSchema = BaseElementSchema.extend({
	element: z.literal("text"),
	value: z.string(),
	styles: TextElementStylesSchema.optional(),
});

const LinkElementStylesSchema = z.object({
	textDecoration: z
		.union([z.literal("underline"), z.literal("none")])
		.optional(),
});

const LinkElementSchema = BaseElementSchema.extend({
	element: z.literal("link"),
	value: z.string(),
	src: z.string(),
	styles: LinkElementStylesSchema.optional(),
});

const ImageElementStylesSchema = z.object({
	width: z.coerce.number().optional(),
	position: z
		.union([z.literal("left"), z.literal("center"), z.literal("right")])
		.optional(),
});

const ImageElementSchema = BaseElementSchema.extend({
	element: z.literal("image"),
	value: z.string(),
	alt: z.string().optional(),
	styles: ImageElementStylesSchema.optional(),
});

const ButtonElementStylesSchema = z.object({
	backgroundColor: z.string().optional(),
	color: z.string().optional(),
});

const ButtonElementSchema = BaseElementSchema.extend({
	element: z.literal("button"),
	value: z.string(),
	src: z.string(),
	styles: ButtonElementStylesSchema.optional(),
});

const ContainerElementSchema = BaseElementSchema.extend({
	element: z.literal("container"),
});

const LandingElementSchema = z.discriminatedUnion("element", [
	TextElementSchema,
	LinkElementSchema,
	ImageElementSchema,
	ButtonElementSchema,
	ContainerElementSchema,
]);

const LandingPageSchema = z.object({
	elements: z.array(LandingElementSchema),
	version: z.number(),
});

// TODO: if it won't be needed in #25 remove it
export function validateLandingPage(data: unknown): LandingPage {
	return LandingPageSchema.parse(data);
}
