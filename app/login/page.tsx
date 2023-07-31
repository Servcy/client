"use client";

import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";
// Icons
import { BiLogIn } from "react-icons/bi";
import { BsTelephoneFill } from "react-icons/bs";
import { GrSecure } from "react-icons/gr";
import { HiMail } from "react-icons/hi";
import { RiWhatsappLine } from "react-icons/ri";
// Types
import { LoginState } from "@/types/Authentication/login";
import { ReducerAction } from "@/types/Shared";
// Utils
import {
  validateEmail,
  validateOtp,
  validatePhone,
} from "@/utils/Shared/validators";
// APIs
import {
  sendOtp as sendOtpApi,
  verifyOtp as verifyOtpApi,
} from "@/apis/authentication";

const initialState: LoginState = {
  email: "",
  phone_number: "",
  code_email: "",
  code_phone: "",
  phone_is_whatsapp: false,
  agree_terms_conditions_and_privacy_policy: false,
};

const reducer = (state: LoginState, action: ReducerAction) => {
  switch (action.type) {
    case "email":
      return { ...state, email: action.payload };
    case "phone_number":
      return { ...state, phone_number: action.payload };
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
  const [stage, setStage] = useState(0);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidEmailOtp, setInvalidEmailOtp] = useState(false);
  const [invalidPhoneOtp, setInvalidPhoneOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      const email = document.getElementById("email") as HTMLInputElement;
      const phone_number = document.getElementById(
        "phone_number"
      ) as HTMLInputElement;
      const phone_is_whatsapp = document.getElementById(
        "phone_is_whatsapp"
      ) as HTMLInputElement;
      const agree_terms_conditions_and_privacy_policy = document.getElementById(
        "agree_terms_conditions_and_privacy_policy"
      ) as HTMLInputElement;
      // validate email address and phone number
      setInvalidEmail(!validateEmail(email.value));
      setInvalidPhone(!validatePhone(phone_number.value));
      if (
        !validateEmail(email.value) ||
        !validatePhone(phone_number.value) ||
        !agree_terms_conditions_and_privacy_policy.checked
      )
        return;
      dispatch({
        type: "email",
        payload: email.value,
      });
      dispatch({
        type: "phone_number",
        payload: phone_number.value,
      });
      dispatch({
        type: "phone_is_whatsapp",
        payload: phone_is_whatsapp.checked,
      });
      dispatch({
        type: "agree_terms_conditions_and_privacy_policy",
        payload: agree_terms_conditions_and_privacy_policy.checked,
      });
      await sendOtpApi(
        email.value,
        phone_number.value,
        phone_is_whatsapp.checked
      );
      setStage(1);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const code_email = document.getElementById(
        "code_email"
      ) as HTMLInputElement;
      const code_phone = document.getElementById(
        "code_phone"
      ) as HTMLInputElement;
      setInvalidEmailOtp(!validateOtp(code_email.value));
      setInvalidPhoneOtp(!validateOtp(code_phone.value));
      if (!validateOtp(code_email.value) || !validateOtp(code_phone.value))
        return;
      dispatch({
        type: "code_email",
        payload: code_email.value,
      });
      dispatch({
        type: "code_phone",
        payload: code_phone.value,
      });
      verifyOtpApi(
        state.code_email,
        state.code_phone,
        state.email,
        state.phone_number,
        state.phone_is_whatsapp
      );
      router.push("/");
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
          {/* email and corresponding otp */}
          <div>
            {stage === 0 ? (
              <TextInput
                id="email"
                color={invalidEmail ? "failure" : "default"}
                icon={HiMail}
                required
                placeholder="name@company.com"
                type="email"
                className="mb-[24px]"
              />
            ) : (
              <TextInput
                autoComplete="off"
                id="code_email"
                icon={GrSecure}
                required
                placeholder="Enter the code sent to your email"
                type="text"
                rightIcon={HiMail}
                className="mb-[24px]"
                color={invalidEmailOtp ? "failure" : "default"}
              />
            )}
          </div>
          {/* phone number and country code input and corresponding otp */}
          {stage === 0 ? (
            <TextInput
              icon={BsTelephoneFill}
              id="phone_number"
              required
              type="tel"
              color={invalidPhone ? "failure" : "default"}
              placeholder="+123 456 7890"
              className="mb-[24px] w-full"
            />
          ) : (
            <TextInput
              icon={GrSecure}
              id="code_phone"
              required
              placeholder="Enter the code sent to your phone number"
              type="text"
              className="mb-[24px] w-full"
              rightIcon={BsTelephoneFill}
              color={invalidPhoneOtp ? "failure" : "default"}
            />
          )}
          {/* is whatsapp & privacy & T&C checkbox */}
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
                  required
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
            isProcessing={loading}
          >
            {stage === 0 ? "Send OTP" : "Login"}{" "}
            <BiLogIn className="ml-3 inline" />
          </Button>
        </form>
      </Card>
    </main>
  );
}
