import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../env";

export function signJwt(userId: string): string {
	return jwt.sign({ sub: userId }, env.SECRET_KEY, { expiresIn: "3d" });
}

export function verifyJwt(token: string): string | null {
	try {
		const { sub } = jwt.verify(token, env.SECRET_KEY) as JwtPayload;

		return sub ?? null;	
	} catch {
		return null;
	}
}
