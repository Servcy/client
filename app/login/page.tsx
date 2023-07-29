"use client";

import { LoginState } from "@/types/Authentication/login";
import { ReducerAction } from "@/types/Shared";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import Image from "next/image";
import { useReducer } from "react";
import { RiWhatsappLine } from "react-icons/ri";

const initialState: LoginState = {
  email: "",
  phone: "",
  code_email: "",
  code_phone: "",
  phone_is_whatsapp: false,
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

  return state.email && state.phone ? (
    <div>Stage-2</div>
  ) : (
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
          <TextInput
            id="email"
            placeholder="Please enter your email address"
            required
            type="email"
            className="mb-[24px] placeholder:mx-auto"
          />
          <TextInput
            id="phone"
            placeholder="Please enter your phone number"
            required
            type="phone"
            className="mb-[24px] placeholder:mx-auto"
          />
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
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const email = document.getElementById(
                "email"
              ) as HTMLInputElement;
              const phone = document.getElementById(
                "phone"
              ) as HTMLInputElement;
              const phone_is_whatsapp = document.getElementById(
                "phone_is_whatsapp"
              ) as HTMLInputElement;
              const agree_terms_conditions_and_privacy_policy =
                document.getElementById(
                  "agree_terms_conditions_and_privacy_policy"
                ) as HTMLInputElement;
              dispatch({
                type: "email",
                payload: email.value,
              });
              dispatch({
                type: "phone",
                payload: phone.value,
              });
              dispatch({
                type: "phone_is_whatsapp",
                payload: phone_is_whatsapp.checked,
              });
              dispatch({
                type: "agree_terms_conditions_and_privacy_policy",
                payload: agree_terms_conditions_and_privacy_policy.checked,
              });
            }}
            className="w-full"
            gradientDuoTone="greenToBlue"
          >
            Login
          </Button>
        </form>
      </Card>
    </main>
  );
}
