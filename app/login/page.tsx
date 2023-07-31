"use client";

import country_codes from "@/constants/country_codes.json";
import {
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import Image from "next/image";
import { useReducer, useState } from "react";
// Icons
import { BiLogIn } from "react-icons/bi";
import { BsTelephoneFill } from "react-icons/bs";
import { GrSecure } from "react-icons/gr";
import { HiMail } from "react-icons/hi";
import { RiWhatsappLine } from "react-icons/ri";
import { VscLoading } from "react-icons/vsc";
// Types
import { LoginState } from "@/types/Authentication/login";
import { ReducerAction } from "@/types/Shared";

const initialState: LoginState = {
  email: "",
  phone: "",
  code_email: "",
  code_phone: "",
  phone_is_whatsapp: false,
  country_code: "+91",
  agree_terms_conditions_and_privacy_policy: false,
};

const reducer = (state: LoginState, action: ReducerAction) => {
  switch (action.type) {
    case "email":
      return { ...state, email: action.payload };
    case "phone":
      return { ...state, phone: action.payload };
    case "code_email":
      return { ...state, code_email: action.payload };
    case "code_phone":
      return { ...state, code_phone: action.payload };
    case "phone_is_whatsapp":
      return { ...state, phone_is_whatsapp: action.payload };
    default:
      return state;
  }
};
export default function Login(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stage, setStage] = useState(1);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (input: string) => {
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(input);
  };

  const validatePhone = (input: string) => {
    const phoneRegex =
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    return phoneRegex.test(input);
  };

  const sendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      const email = document.getElementById("email") as HTMLInputElement;
      const phone = document.getElementById("phone") as HTMLInputElement;
      const country_code = document.getElementById(
        "country_code"
      ) as HTMLInputElement;
      const phone_is_whatsapp = document.getElementById(
        "phone_is_whatsapp"
      ) as HTMLInputElement;
      const agree_terms_conditions_and_privacy_policy = document.getElementById(
        "agree_terms_conditions_and_privacy_policy"
      ) as HTMLInputElement;

      // validate email and phone
      setInvalidEmail(!validateEmail(email.value));
      setInvalidPhone(!validatePhone(phone.value));

      if (!validateEmail(email.value) || !validatePhone(phone.value)) return;

      dispatch({
        type: "email",
        payload: email.value,
      });
      dispatch({
        type: "phone",
        payload: phone.value,
      });
      dispatch({
        type: "country_code",
        payload: country_code.value,
      });
      dispatch({
        type: "phone_is_whatsapp",
        payload: phone_is_whatsapp.checked,
      });
      dispatch({
        type: "agree_terms_conditions_and_privacy_policy",
        payload: agree_terms_conditions_and_privacy_policy.checked,
      });
      setStage(1);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex  min-h-screen w-full">
      <Card className="m-auto w-[450px] text-center">
        <Image
          src="/logo.svg"
          alt="Servcy logo"
          height="64"
          width="64"
          className="mx-auto"
        />
        <h4 className=" font-semibold">Welcome To Servcy</h4>
        <form>
          <div>
            {stage === 0 ? (
              <TextInput
                id="email"
                color={invalidEmail ? "failure" : "default"}
                icon={HiMail}
                required
                type="email"
                className="mb-[24px]"
              />
            ) : (
              <TextInput
                id="code_email"
                icon={GrSecure}
                required
                placeholder="Enter the code sent to your email"
                type="text"
                className="mb-[24px]"
              />
            )}
          </div>
          <div className="flex w-full">
            {stage === 0 ? (
              <>
                <Select id="country_code" className="mr-2 min-w-[80px]">
                  {country_codes.map((country_code) => (
                    <option
                      value={country_code.dial_code}
                      key={country_code.code}
                    >
                      {country_code.dial_code}
                    </option>
                  ))}
                </Select>
                <TextInput
                  icon={BsTelephoneFill}
                  id="phone"
                  required
                  type="tel"
                  color={invalidPhone ? "failure" : "default"}
                  className="mb-[24px] w-full"
                />
              </>
            ) : (
              <TextInput
                icon={GrSecure}
                id="code_phone"
                required
                placeholder="Enter the code sent to your phone"
                type="text"
                className="mb-[24px] w-full"
              />
            )}
          </div>
          {stage === 0 ? (
            <>
              <div className="flex">
                <Checkbox
                  id="phone_is_whatsapp"
                  className="mr-2 checked:bg-green-700 hover:ring-2 hover:ring-green-500"
                />
                <Label htmlFor="phone_is_whatsapp" className="mb-6 font-normal">
                  Is this your&nbsp;
                  <RiWhatsappLine size="16" className="inline text-green-500" />
                  &nbsp;<span className="text-green-500">WhatsApp</span>
                  &nbsp;number?
                </Label>
              </div>
              <div className="flex">
                <Checkbox
                  id="agree_terms_conditions_and_privacy_policy"
                  className="mr-2 checked:bg-green-700 hover:ring-2 hover:ring-green-500"
                />
                <Label
                  htmlFor="agree_terms_conditions_and_privacy_policy"
                  className="mb-6 font-normal"
                >
                  I agree to Servcys Privacy Policy & Terms of Service
                </Label>
              </div>
            </>
          ) : null}
          <Button
            type="submit"
            onClick={stage === 0 ? sendOtp : verifyOtp}
            className="w-full"
            gradientDuoTone="greenToBlue"
            disabled={loading}
          >
            {stage === 0 ? "Send OTP" : "Verify & Login"}{" "}
            {!loading ? (
              <BiLogIn className="ml-3 inline" />
            ) : (
              <VscLoading className="ml-3 inline animate-spin" />
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}
