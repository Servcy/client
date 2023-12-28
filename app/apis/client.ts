import { axiosGet, axiosPost } from "@/utils/Shared/axios";

export const fetchClients = async (search = "") => {
  const response = await axiosGet("/client/", { search });
  return response.results;
};

export const createClient = async (data: any) => {
  const response = await axiosPost("/client/", data);
  return response;
};
