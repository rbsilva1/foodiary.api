import jwt from "jsonwebtoken";
import { env } from "../env";

export function signJwt(userId: string): string {
  return jwt.sign({ sub: userId }, env.SECRET_KEY, { expiresIn: "3d" });
}