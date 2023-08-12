import { axiosGet, axiosPut } from "@/utils/Shared/axios";

export const fetchIntegrations = async () => {
  const response = await axiosGet("/integration/", {});
  return response.results;
};

export const googleOauth = async (code: string, scope: string) => {
  const response = await axiosPut("/integration/google/oauth", {
    code,
    scope,
  });
  return response;
};
