import { axiosGet, axiosPost } from "@/utils/Shared/axios";

export const fetchProjects = async () => {
  const response = await axiosGet("/project/", {});
  return response.results;
};

export const createProject = async (data: any) => {
  const response = await axiosPost("/project/", data);
  return response;
};
