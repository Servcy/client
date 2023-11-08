import { axiosPost } from "@/utils/Shared/axios";

export const logout = async () => {
  const response = await axiosPost("/logout", {});
  return response;
};
