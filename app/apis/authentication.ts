import Axios from "axios";

const SERVER_URL = process.env["NEXT_PUBLIC_SERVER_URL"];

export const verifyOtp = async (
  code_email: string,
  code_phone: string,
  email: string,
  phone_number: string,
  phone_is_whatsapp: boolean
) => {
  const response = Axios.post(`${SERVER_URL}/authentication`, {
    code_email,
    code_phone,
    email,
    phone_number: phone_number.replace("+", ""),
    is_whatsapp: phone_is_whatsapp,
  });
  const { data } = await response;
  return data;
};

export const sendOtp = async (
  email: string,
  phone_number: string,
  phone_is_whatsapp: boolean
) => {
  const is_whatsapp = phone_is_whatsapp ? "yes" : "no";
  const response = Axios.get(
    `${SERVER_URL}/authentication?email=${email}&phone_number=${phone_number.replace(
      "+",
      ""
    )}&is_whatsapp=${is_whatsapp}`
  );
  const { data } = await response;
  return data;
};
