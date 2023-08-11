import Axios from "axios";

const SERVER_URL = process.env["NEXT_PUBLIC_SERVER_URL"];

export const verifyOtp = async (
  otp: string,
  input: string,
  inputType: string
) => {
  const response = Axios.post(`${SERVER_URL}/authentication`, {
    otp,
    input,
    input_type: inputType,
  });
  const { data } = await response;
  return data;
};

export const sendOtp = async (input: string, inputType: string) => {
  const response = Axios.get(
    `${SERVER_URL}/authentication?input=${input}&input_type=${inputType}`
  );
  const { data } = await response;
  return data;
};
