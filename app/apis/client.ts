import { axiosGet, axiosPost } from "@/utils/Shared/axios";

export const fetchClients = async () => {
  const response = await axiosGet("/client/", {});
  return response.results;
};

export const createClient = async (data: any) => {
  const response = await axiosPost("/client/", data);
  return response;
};
