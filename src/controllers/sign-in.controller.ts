import { z } from "zod";
import type { HttpRequest, HttpResponse } from "../types/http.type";
import { badRequest, ok } from "../utils/http";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export class SignInController {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return badRequest({
        errors: result.error.issues
      });
    }

		return ok({
			accessToken: "token de acesso",
      data: result.data
		});
	}
}
