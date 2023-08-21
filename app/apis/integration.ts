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

export const microsoftOauth = async (
  code: string,
  state: string,
  session_state: string
) => {
  const response = await axiosPut("/integration/microsoft/oauth", {
    code,
    state,
    session_state,
  });
  return response;
};
