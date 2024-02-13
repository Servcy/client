import { axiosPost } from "@/utils/Shared/axios";

export const fetchInbox = async (payload: object) => {
  const response = await axiosPost("/inbox/items", payload);
  return response;
};

export const archiveItems = async (payload: object) => {
  const response = await axiosPost("/inbox/archive", payload);
  return response;
};

export const generateReply = async (payload: object) => {
  const response = await axiosPost("/inbox/assisstant/generate-reply", payload);
  return response;
};

export const sendReply = async (payload: object) => {
  const response = await axiosPost("/inbox/send-reply", payload);
  return response;
};
