import z from "zod";
import type { HttpRequest, HttpResponse } from "../types/http.type";
import { badRequest, created } from "../utils/http";

const schema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain']),
  gender: z.enum(['male', 'female']),
  birthDate: z.iso.date(),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().int().min(1).max(5),
  account: z.object({
    email: z.email(),
    password: z.string().min(8),
  })
});


export class SignUpController {
	async handle(request: HttpRequest): Promise<HttpResponse> {

    const result = schema.safeParse(request.body);

    if (!result.success) {
      return badRequest({
        errors: result.error.issues
      });
    }

		return created({
			accessToken: "token de acesso",
      data: result.data
		});
	}
}
