import { axiosPost } from "@/utils/Shared/axios";

export const fetchInbox = async (payload: object) => {
  const response = await axiosPost("/inbox/items", payload);
  return response;
};

export const archiveItems = async (payload: object) => {
  const response = await axiosPost("/inbox/archive", payload);
  return response;
};

export const deleteItem = async (payload: object) => {
  const response = await axiosPost("/inbox/delete", payload);
  return response;
};
