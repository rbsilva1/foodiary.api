import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import type { HttpResponse, ProtectedHttpRequest } from "../types/http.type";
import { badRequest, ok } from "../utils/http";

const schema = z.object({
	mealId: z.uuid(),
});

export class GetMealByIdController {
	async handle({
		userId,
		params,
	}: ProtectedHttpRequest): Promise<HttpResponse> {
		const result = schema.safeParse(params);

		if (!result.success) {
			return badRequest({
				errors: result.error.issues,
			});
		}

		const [meal] = await db.query.mealsTable.findMany({
			where: and(
				eq(mealsTable.userId, userId),
				eq(mealsTable.id, result.data.mealId),
			),
			columns: {
				id: true,
				foods: true,
				createdAt: true,
				icon: true,
				name: true,
				status: true,
			},
		});

		return ok({ meal });
	}
}
