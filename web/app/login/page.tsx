"use client"

import Image from "next/image"
import Link from "next/link.js"

import { useEffect, useState } from "react"

import type { NextPageWithWrapper } from "@/types/index"
import { GoogleLogin } from "@react-oauth/google"
import { Button, Input } from "antd"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"
import { BiLogIn } from "react-icons/bi"
import { HiMail } from "react-icons/hi"
import { RiWhatsappLine } from "react-icons/ri"

import OTPInput from "@components/login/OTPInput"

import { useUser } from "@hooks/store"
import useLoginRedirection from "@hooks/use-login-redirection"

import { AuthService } from "@services/auth.service"

import { validateEmail, validateOtp, validatePhone } from "@helpers/validation.helper"

import { Spinner } from "@servcy/ui"

const authService = new AuthService()

const Login: NextPageWithWrapper = observer(() => {
    const [stage, setStage] = useState<number>(0)
    const [inputType, setInputType] = useState<string>("email")
    const [input, setInput] = useState<string>("")
    const [invalidPhone, setInvalidPhone] = useState<boolean>(false)
    const [otp, setOtp] = useState<string>("")
    const { isRedirecting, handleRedirection } = useLoginRedirection()
    const { currentUser } = useUser()
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const sendOtp = async (e: React.MouseEvent | React.KeyboardEvent) => {
        try {
            e.preventDefault()
            setLoading(true)
            const email = document.getElementById("email") as HTMLInputElement
            const phone_number = document.getElementById("phone_number") as HTMLInputElement
            const agree_terms_conditions_and_privacy_policy = document.getElementById(
                "agree_terms_conditions_and_privacy_policy"
            ) as HTMLInputElement
            // validate email address and phone number
            const isEmailValid = validateEmail(email.value)
            const isPhoneValid = validatePhone(phone_number.value)
            if (!isPhoneValid) setInvalidEmail(!isEmailValid)
            else if (!isEmailValid) setInvalidPhone(!isPhoneValid)
            if ((!isEmailValid && !isPhoneValid) || !agree_terms_conditions_and_privacy_policy.checked) return
            setInputType(isEmailValid ? "email" : "phone_number")
            setInput(isEmailValid ? email.value : phone_number.value.replace("+", ""))
            await toast.promise(
                authService.sendOtp(
                    isEmailValid ? email.value : phone_number.value.replace("+", ""),
                    isEmailValid ? "email" : "phone_number"
                ),
                {
                    loading: "Sending OTP...",
                    success: "OTP sent successfully",
                    error: "Failed to send OTP",
                }
            )
            setStage(1)
        } finally {
            setLoading(false)
        }
    }

    const verifyOtp = async (otp: string) => {
        try {
            setLoading(true)
            const otpIsValid = validateOtp(otp)
            if (!otpIsValid) return
            await toast.promise(authService.verifyOtp(otp, input, inputType), {
                loading: "Verifying OTP...",
                success: "OTP verified successfully",
                error: "Failed to verify OTP",
            })
            handleRedirection()
        } finally {
            setLoading(false)
        }
    }

    const googleLogin = async (credential: string) => {
        try {
            setLoading(true)
            await toast.promise(authService.googleLogin(credential), {
                loading: "Logging in..",
                success: "Logged in successfully",
                error: "Failed to login with Google",
            })
            handleRedirection()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleRedirection()
    }, [handleRedirection])

    if (isRedirecting || currentUser)
        return (
            <div className="grid h-screen place-items-center">
                <Spinner />
            </div>
        )

    return (
        <main className="flex min-h-screen w-full bg-servcy-white">
            <div className="m-auto w-[430px] rounded-lg border border-servcy-black bg-servcy-black p-10 text-center text-servcy-white shadow-md">
                <Image src="/logo.svg" alt="Servcy logo" height="64" width="64" className="mx-auto" />
                <h4 className="my-5 font-semibold">Welcome To Servcy</h4>
                <form>
                    {/* email and corresponding otp */}
                    {stage === 0 ? (
                        <>
                            <Input
                                id="email"
                                color={invalidEmail ? "failure" : "default"}
                                prefix={<HiMail className="mr-1" />}
                                required
                                onKeyDown={(event) => {
                                    if (event.code === "Enter") sendOtp(event)
                                }}
                                placeholder="name@company.com"
                                type="email"
                                className="mb-[16px] p-3 text-sm"
                            />
                            <h2 className="servcy-hr-lines mb-[16px]">Or</h2>
                            <Input
                                id="phone_number"
                                color={invalidPhone ? "failure" : "default"}
                                prefix={<RiWhatsappLine className="mr-1" />}
                                required
                                onKeyDown={(event) => {
                                    if (event.code === "Enter") sendOtp(event)
                                }}
                                placeholder="+123 456 7890"
                                type="email"
                                className="mb-[16px] p-3 text-sm"
                            />
                            <div className="mb-6 text-left">
                                <input
                                    id="agree_terms_conditions_and_privacy_policy"
                                    type="checkbox"
                                    checked
                                    onChange={() => {}}
                                    className="mr-2 accent-servcy-light"
                                />
                                <span className="text-sm font-normal">
                                    I agree to Servcys&nbsp;
                                    <Link
                                        className="text-servcy-light"
                                        href="https://servcy.com/documents/privacy-policy/"
                                        target="_blank"
                                    >
                                        Privacy Policy
                                    </Link>
                                    &nbsp;&&nbsp;
                                    <Link
                                        className="text-servcy-light"
                                        href="https://servcy.com/documents/terms-and-conditions"
                                        target="_blank"
                                    >
                                        Terms of Service
                                    </Link>
                                </span>
                            </div>
                            <Button
                                type="default"
                                onClick={sendOtp}
                                className="flex w-full items-center justify-center text-center font-medium !text-servcy-white hover:!border-servcy-wheat hover:!text-servcy-wheat"
                                disabled={loading}
                                size="large"
                                loading={loading}
                            >
                                {!loading && <BiLogIn className="mr-2 inline" />} Send OTP
                            </Button>
                            <h2 className="servcy-hr-lines my-4">Or</h2>
                            <div className="flex place-content-center">
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        const { credential } = credentialResponse
                                        const agree_terms_conditions_and_privacy_policy = document.getElementById(
                                            "agree_terms_conditions_and_privacy_policy"
                                        ) as HTMLInputElement
                                        if (!agree_terms_conditions_and_privacy_policy.checked) {
                                            toast.error(
                                                "Please agree to our privacy policy and TOS by checking the checkbox"
                                            )
                                            return
                                        }
                                        if (credential) googleLogin(credential)
                                        else toast.error("Failed to login with Google")
                                    }}
                                    onError={() => {
                                        toast.error("Failed to login with Google")
                                    }}
                                    auto_select
                                    useOneTap
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="servcy-hr-lines mb-[16px]">Enter OTP</h2>
                            <OTPInput
                                {...{
                                    value: otp,
                                    numInputs: 6,
                                    onChange: (otp: string, activeInput: number) => {
                                        setOtp(otp)
                                        if (activeInput === 5) verifyOtp(otp)
                                    },
                                    renderInput: (inputProps: any) =>
                                        loading ? (
                                            <div className="h-10 w-10 animate-pulse rounded-full bg-servcy-white" />
                                        ) : (
                                            <Input
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
            </div>
        </main>
    )
})

export default Login
