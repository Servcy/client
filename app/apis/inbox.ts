import { axiosPost } from "@/utils/Shared/axios";

export const fetchInbox = async (payload: object) => {
  const response = await axiosPost("/inbox/items", payload);
  return response;
};
