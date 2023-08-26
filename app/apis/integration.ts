import { axiosGet, axiosPut } from "@/utils/Shared/axios";

export const fetchIntegrations = async () => {
  const response = await axiosGet("/integration/", {});
  return response.results;
};

export const integrationOauth = async (
  payload: object,
  integrationName: string
) => {
  const response = await axiosPut(
    `/integration/${integrationName}/oauth`,
    payload
  );
  return response;
};
