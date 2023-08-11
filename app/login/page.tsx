"use client";

import { setCookie } from "cookies-next";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link.js";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Icons
import { BiLogIn } from "react-icons/bi";
import { HiMail } from "react-icons/hi";
import { RiWhatsappLine } from "react-icons/ri";
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
// Components
import OTPInput from "@/components/Login/OTPInput";

export default function Login(): JSX.Element {
  const [stage, setStage] = useState<number>(0);
  const [inputType, setInputType] = useState<string>("email");
  const [input, setInput] = useState<string>("");
  const [invalidPhone, setInvalidPhone] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const sendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      const email = document.getElementById("email") as HTMLInputElement;
      const phone_number = document.getElementById(
        "phone_number"
      ) as HTMLInputElement;
      const agree_terms_conditions_and_privacy_policy = document.getElementById(
        "agree_terms_conditions_and_privacy_policy"
      ) as HTMLInputElement;
      // validate email address and phone number
      const isEmailValid = validateEmail(email.value);
      const isPhoneValid = validatePhone(phone_number.value);
      if (!isPhoneValid) setInvalidEmail(!isEmailValid);
      else if (!isEmailValid) setInvalidPhone(!isPhoneValid);
      if (
        (!isEmailValid && !isPhoneValid) ||
        !agree_terms_conditions_and_privacy_policy.checked
      )
        return;
      setInputType(isEmailValid ? "email" : "phone_number");
      setInput(
        isEmailValid ? email.value : phone_number.value.replace("+", "")
      );
      await sendOtpApi(
        isEmailValid ? email.value : phone_number.value.replace("+", ""),
        isEmailValid ? "email" : "phone_number"
      );
      setStage(1);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      setLoading(true);
      const otpIsValid = validateOtp(otp);
      if (!otpIsValid) return;
      const tokens = await verifyOtpApi(otp, input, inputType);
      setCookie("refreshToken", tokens.refresh_token, {
        path: "/",
      });
      setCookie("accessToken", tokens.access_token, {
        path: "/",
      });
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex  min-h-screen w-full">
      <Card className="m-auto w-[430px] text-center">
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
          {stage === 0 ? (
            <>
              <TextInput
                id="email"
                color={invalidEmail ? "failure" : "default"}
                icon={HiMail}
                required
                placeholder="name@company.com"
                type="email"
                className="mb-[16px]"
              />
              <h2 className="s-hr-lines mb-[16px]">Or</h2>
              <TextInput
                icon={RiWhatsappLine}
                id="phone_number"
                required
                type="tel"
                color={invalidPhone ? "failure" : "default"}
                placeholder="+123 456 7890"
                className="mb-[24px] w-full"
              />
              <div className="flex">
                <Checkbox
                  id="agree_terms_conditions_and_privacy_policy"
                  className="mr-2 checked:bg-green-700 hover:ring-2 hover:ring-green-500"
                  required
                />
                <Label
                  htmlFor="agree_terms_conditions_and_privacy_policy"
                  className="mb-4 font-normal"
                >
                  I agree to Servcys&nbsp;
                  <Link
                    className="text-green-500"
                    href="https://servcy.com/documents/privacy-policy/"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                  &nbsp;&&nbsp;
                  <Link
                    className="text-green-500"
                    href="https://servcy.com/documents/terms-and-conditions"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                onClick={sendOtp}
                className="w-full"
                gradientDuoTone="greenToBlue"
                disabled={loading}
                isProcessing={loading}
              >
                Send OTP <BiLogIn className="ml-3 inline" />
              </Button>
            </>
          ) : (
            <>
              <h2 className="s-hr-lines mb-[16px]">Enter OTP</h2>
              <OTPInput
                {...{
                  value: otp,
                  numInputs: 6,
                  onChange: (otp: string) => {
                    setOtp(otp);
                    if (otp.length === 6) verifyOtp(otp);
                  },
                  renderInput: (inputProps) => (
                    <TextInput
                      {...inputProps}
                      className="h-10 text-center"
                      type="text"
                      maxLength={1}
                      required
                    />
                  ),
                  containerStyle: "flex justify-between w-full my-4",
                  shouldAutoFocus: true,
                }}
              />
            </>
          )}
        </form>
      </Card>
    </main>
  );
}
