import { z } from "zod";

const allowedRpeValues = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

const rpeSchema = z
  .number()
  .refine((value) => allowedRpeValues.includes(value), {
    message: `RPE must be one of: ${allowedRpeValues.join(", ")}`,
  })
  .nullable();

const setSchema = z.object({
  numberOfReps: z.number().int().min(1).max(999),
  rpe: rpeSchema,
});

const linkSchema = z.object({
  text: z.string().max(20),
  url: z.string().max(200),
});

const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Date must be a valid date-time string",
  });

export const createLiftLogSchema = z.object({
  title: z.string().max(50),
  name: z.string().min(2).max(20),
});

export const liftLogEntrySchema = z
  .object({
    name: z.string().max(30),
    weightLifted: z.number().min(0).max(999),
    date: dateSchema,
    sets: z.array(setSchema),
    comment: z.string().max(400).nullable().optional(),
    links: z.array(linkSchema).max(3).nullable().optional(),
  })
  .transform((entry) => ({
    ...entry,
    date: new Date(entry.date).toISOString(),
    comment: entry.comment ?? null,
    links: entry.links ?? null,
  }));

export type ValidationIssue = {
  path: string;
  message: string;
};

export const toValidationIssues = (
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): ValidationIssue[] =>
  issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));
