import { axiosGet } from "@/utils/Shared/axios";

export const fetchIntegrations = async () => {
  const response = await axiosGet("/integration/", {});
  return response.results;
};
