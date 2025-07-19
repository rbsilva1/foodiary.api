import z from "zod";
import { db } from "../db";
import { mealsTable } from "../db/schema";
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

		return created({ id: meal.id });
	}
}
