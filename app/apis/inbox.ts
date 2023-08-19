import { axiosGet } from "@/utils/Shared/axios";

export const syncInbox = async () => {
  const response = await axiosGet("/inbox/sync", {});
  return response;
};
