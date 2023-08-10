import { JwtToken } from "@/types/Authentication/jwt";
import jwtDecode from "jwt-decode";

export const isJwtTokenValid = (token: string) => {
  if (process.env["NEXT_PUBLIC_DEV_MODE"] === "true") return true;
  if (!token) return false;
  const extractedToken: JwtToken = jwtDecode(token) as JwtToken;
  const expirationTime = extractedToken.exp * 1000;
  const timediff = expirationTime - Date.now();
  if (timediff <= 0) {
    return false;
  }
  return token;
};
