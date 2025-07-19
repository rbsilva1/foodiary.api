import type { HttpResponse } from "../types/http.type";

export function parseResponse(response: HttpResponse): Record<string, any> {
	return {
		statusCode: response.statusCode,
		body: JSON.stringify(response.body || {}),
	};
}
