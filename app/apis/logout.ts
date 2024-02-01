import { axiosPost } from "@/utils/Shared/axios";

export const logout = async (refreshToken: string) => {
  const response = await axiosPost("/logout", {
    refresh_token: refreshToken,
  });
  return response;
};
