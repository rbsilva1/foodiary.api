import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { verifyJwt } from "../lib/jwt";
import type { ProtectedHttpRequest } from "../types/http.type";
import { parseEvent } from "./parse-event";

export function parseProtectedEvent(
	event: APIGatewayProxyEventV2,
): ProtectedHttpRequest {
	const baseEvent = parseEvent(event);
	const body = JSON.parse(event.body ?? "{}");
	const params = event.pathParameters ?? {};
	const queryParams = event.queryStringParameters ?? {};
	const { authorization } = event.headers;

	if (!authorization) {
		throw new Error("Authorization header is missing");
	}

	const [, token] = authorization.split(" ");

	if (!token) {
		throw new Error("Token is missing in the Authorization header");
	}

	const userId = verifyJwt(token);

	if (!userId) {
		throw new Error("Invalid token");
	}

	return {
		...baseEvent,
		body,
		params,
		queryParams,
		userId,
	};
}
