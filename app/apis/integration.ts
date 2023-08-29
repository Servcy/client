import { axiosGet, axiosPut } from "@/utils/Shared/axios";

export const fetchIntegrations = async () => {
  const response = await axiosGet("/integration/", {});
  return response.results;
};

export const integrationOauth = async (payload: object, slug: string) => {
  const response = await axiosPut(`/integration/oauth/${slug}`, payload);
  return response;
};

export const configureFigma = async (payload: object) => {
  const response = await axiosPut("/integration/figma/configure", payload);
  return response;
};
