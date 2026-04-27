import { z } from "zod";
import { type LandingPage } from "./types";

const BaseElementSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  index: z.number(),
});

const TextElementSchema = BaseElementSchema.extend({
  element: z.literal("text"),
  value: z.string(),
});

const LinkElementSchema = BaseElementSchema.extend({
  element: z.literal("link"),
  value: z.string(),
  src: z.string(),
});

const ImageElementSchema = BaseElementSchema.extend({
  element: z.literal("image"),
  value: z.string(),
  alt: z.string().optional(),
});

const ButtonElementSchema = BaseElementSchema.extend({
  element: z.literal("button"),
  value: z.string(),
  src: z.string(),
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
});

export function validateLandingPage(data: any): LandingPage {
  return LandingPageSchema.parse(data);
}
