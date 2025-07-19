import { hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema";
import type { HttpRequest, HttpResponse } from "../types/http.type";
import { badRequest, conflict, created } from "../utils/http";

const schema = z.object({
	goal: z.enum(["lose", "maintain", "gain"]),
	gender: z.enum(["male", "female"]),
	birthDate: z.iso.date(),
	name: z.string().min(1).max(255),
	height: z.number(),
	weight: z.number(),
	activityLevel: z.number().int().min(1).max(5),
	account: z.object({
		email: z.email(),
		password: z.string().min(8),
	}),
});

export class SignUpController {
	async handle(request: HttpRequest): Promise<HttpResponse> {
		const result = schema.safeParse(request.body);

		if (!result.success) {
			return badRequest({
				errors: result.error.issues,
			});
		}

		const userAlreadyExists = await db.query.usersTable.findFirst({
			columns: {
				email: true,
			},
			where: eq(usersTable.email, result.data.account.email),
		});

		if (userAlreadyExists) {
			return conflict({
				error: "User already exists with this email.",
			});
		}

		const hashedPassword = await hash(result.data.account.password, 10);

		const [user] = await db
			.insert(usersTable)
			.values({
				...result.data,
				...result.data.account,
        password: hashedPassword,
				calories: 0, // Default values for goals
				proteins: 0,
				carbs: 0,
				fats: 0,
			})
			.returning({
				id: usersTable.id,
			});

		return created({
			accessToken: "token de acesso",
			userId: user.id,
		});
	}
}
