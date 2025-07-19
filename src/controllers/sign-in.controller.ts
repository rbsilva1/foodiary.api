import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { env } from "../env";
import { signJwt } from "../lib/jwt";
import type { HttpRequest, HttpResponse } from "../types/http.type";
import { badRequest, ok, unauthorized } from "../utils/http";

const schema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export class SignInController {
	async handle(request: HttpRequest): Promise<HttpResponse> {
		const result = schema.safeParse(request.body);

		if (!result.success) {
			return badRequest({
				errors: result.error.issues,
			});
		}

		const user = await db.query.usersTable.findFirst({
			columns: {
				id: true,
				email: true,
				password: true,
			},
			where: eq(usersTable.email, result.data.email),
		});

		if (!user) {
			return unauthorized({
				error: "Invalid email or password.",
			});
		}

		const isPasswordValid = await compare(result.data.password, user.password);

		if (!isPasswordValid) {
			return unauthorized({
				error: "Invalid email or password.",
			});
		}

		const accessToken = signJwt(user.id);

		return ok({
			accessToken,
		});
	}
}
