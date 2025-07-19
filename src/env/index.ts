import z from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string(),
	SECRET_KEY: z.string().min(1, "SECRET_KEY is required"),
});

export const env = envSchema.parse(process.env);
