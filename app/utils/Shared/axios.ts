import Axios from "axios";

import { refreshTokensApi } from "@/apis/authentication";
import { isJwtTokenValid } from "@/utils/Authentication/jwt";
import { getCookie, setCookie } from "cookies-next";

const SERVER_URL = process.env["NEXT_PUBLIC_SERVER_URL"];

export const axiosGet = async (url: string, params: Record<string, string>) => {
  const encodedParams = new URLSearchParams();
  const accessToken = String(getCookie("accessToken") ?? "");
  const refreshToken = String(getCookie("refreshToken") ?? "");
  if (isJwtTokenValid(refreshToken) && !isJwtTokenValid(accessToken))
    refreshTokensApi(refreshToken, setCookie);
  Object.keys(params).forEach((key: string) => {
    encodedParams.append(key, params[key] ?? "");
  });
  const response = await Axios.get(`${SERVER_URL}${url}`, {
    params: encodedParams,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { data } = response;
  return data;
};
