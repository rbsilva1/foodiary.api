import { and, eq, gte, lte } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import type { HttpResponse, ProtectedHttpRequest } from "../types/http.type";
import { badRequest, ok } from "../utils/http";

const schema = z.object({
	date: z.iso.date().transform((date) => new Date(date)),
});

export class ListMealsController {
	async handle({
		userId,
		queryParams,
	}: ProtectedHttpRequest): Promise<HttpResponse> {
		const result = schema.safeParse(queryParams);

		if (!result.success) {
			return badRequest({
				errors: result.error.issues,
			});
		}

		const endDate = new Date(result.data.date);
		endDate.setUTCHours(23, 59, 59, 999);

		const meals = await db.query.mealsTable.findMany({
			where: and(
				eq(mealsTable.userId, userId),
				gte(mealsTable.createdAt, result.data.date),
				lte(mealsTable.createdAt, endDate),
				eq(mealsTable.status, "success")
			),
			columns: {
				id: true,
				foods: true,
				createdAt: true,
				icon: true,
				name: true,
			},
		});

		return ok({ meals });
	}
}
