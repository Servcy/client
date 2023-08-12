import jwtDecode from "jwt-decode";

export interface JwtToken {
  exp: number;
}

export const isJwtTokenValid = (token: string) => {
  if (!token) return false;
  const extractedToken: JwtToken = jwtDecode(token) as JwtToken;
  const expirationTime = extractedToken.exp * 1000;
  const timediff = expirationTime - Date.now();
  if (timediff <= 0) {
    return false;
  }
  return token;
};
