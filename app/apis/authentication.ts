import Axios from "axios";

const refreshToken = async () => {
  const { data } = await Axios.post("/api/refreshToken");
  return data;
};

const login = async (email: string, password: string) => {
  const { data } = await Axios.post("/api/login", { email, password });
  return data;
};

const logout = async () => {
  const { data } = await Axios.post("/api/logout");
  return data;
};

export { refreshToken, login, logout };
