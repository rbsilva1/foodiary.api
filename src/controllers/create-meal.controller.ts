import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from "zod";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import { s3Client } from "../lib/s3.client";
import type { HttpResponse, ProtectedHttpRequest } from "../types/http.type";
import { badRequest, created } from "../utils/http";

const schema = z.object({
	fileType: z.enum(["audio/m4a", "image/jpeg"]),
});

export class CreateMealController {
	async handle({ userId, body }: ProtectedHttpRequest): Promise<HttpResponse> {
		const result = schema.safeParse(body);

		if (!result.success) {
			return badRequest({
				errors: result.error.issues,
			});
		}

		const fileId = randomUUID();
		const ext = result.data.fileType === "audio/m4a" ? ".m4a" : ".jpg";
		const fileKey = `${fileId}${ext}`;

		const command = new PutObjectCommand({
			Bucket: process.env.BUCKET_NAME,
			Key: fileKey,
		});

		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 600,
		});

		const [meal] = await db
			.insert(mealsTable)
			.values({
				icon: "",
				inputFileKey: "input-file-key",
				inputType: result.data.fileType === "audio/m4a" ? "audio" : "picture",
				status: "uploading",
				name: "",
				foods: [],
				userId,
			})
			.returning({
				id: mealsTable.id,
			});

		return created({ id: meal.id, uploadUrl: presignedUrl });
	}
}
