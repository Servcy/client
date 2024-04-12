"use client"

import Image from "next/image"
import Link from "next/link.js"
import { useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"

import { GoogleLogin } from "@react-oauth/google"
import { Input } from "antd"
import toast from "react-hot-toast"
import { BiLogIn } from "react-icons/bi"
import { HiMail } from "react-icons/hi"

import OTPInput from "@components/login/OTPInput"

import { useUser } from "@hooks/store"
import useLoginRedirection from "@hooks/use-login-redirection"

import { AuthService } from "@services/auth.service"

import { validateEmail, validateOtp } from "@helpers/validation.helper"

import { Button, Spinner } from "@servcy/ui"

const authService = new AuthService()

export default function Login(): JSX.Element {
    const [inputType, setInputType] = useState<string>("email")
    const [otp, setOtp] = useState<string>("")
    const [input, setInput] = useState<string>("")
    const [stage, setStage] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const { isRedirecting, handleRedirection } = useLoginRedirection()
    const { currentUser } = useUser()
    const searchParams = useSearchParams()

    const sendOtp = async (e?: React.MouseEvent | React.KeyboardEvent) => {
        try {
            if (e) e.preventDefault()
            setLoading(true)
            const email = document.getElementById("email") as HTMLInputElement
            const agree_terms_conditions_and_privacy_policy = document.getElementById(
                "agree_terms_conditions_and_privacy_policy"
            ) as HTMLInputElement
            // validate email address
            const isEmailValid = validateEmail(email.value)
            if (!isEmailValid) {
                toast.error("Please enter a valid email address")
                return
            }
            if (!agree_terms_conditions_and_privacy_policy.checked) {
                toast.error("Please agree to our privacy policy and TOS by checking the checkbox")
                return
            }
            // set input type and value
            setInputType("email")
            setInput(email.value)
            // send otp
            await toast.promise(authService.sendOtp(email.value, "email"), {
                loading: "Sending OTP...",
                success: "OTP sent successfully",
                error: "Failed to send OTP",
            })
            // set stage to otp input
            setStage(1)
        } finally {
            setLoading(false)
        }
    }

    const verifyOtp = async (otp: string) => {
        try {
            setLoading(true)
            // validate otp
            const otpIsValid = validateOtp(otp)
            if (!otpIsValid) return
            // verify otp
            await toast.promise(authService.verifyOtp(otp, input, inputType), {
                loading: "Verifying OTP...",
                success: "OTP verified successfully",
                error: "Failed to verify OTP",
            })
            // handle redirection
            handleRedirection()
        } finally {
            setLoading(false)
        }
    }

    const googleLogin = async (credential: string) => {
        try {
            setLoading(true)
            // login with google
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
        if (searchParams.has("email")) {
            const email = searchParams.get("email") as string
            if (!validateEmail(email)) return
            document.getElementById("email")?.setAttribute("value", email)
            sendOtp()
        }
    }, [searchParams])

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
        <main className="flex min-h-screen w-full">
            <div className="m-auto w-[430px] rounded-lg border border-custom-border-200 bg-onboarding-gradient-200 p-10 text-center shadow-md">
                <Image src="/logo.svg" alt="Servcy logo" height="64" width="64" className="mx-auto" />
                <h4 className="my-5 font-semibold">Welcome To Servcy</h4>
                <form autoComplete="off">
                    {/* email and corresponding otp */}
                    {stage === 0 ? (
                        <>
                            <Input
                                id="email"
                                color="default"
                                prefix={<HiMail className="mr-1" />}
                                required
                                onKeyDown={(event) => {
                                    if (event.code === "Enter") sendOtp(event)
                                }}
                                placeholder="name@company.com"
                                autoComplete="off"
                                type="email"
                                className="mb-[16px] p-3 text-sm"
                            />
                            <div className="mb-6 text-left">
                                <input
                                    id="agree_terms_conditions_and_privacy_policy"
                                    type="checkbox"
                                    checked
                                    onChange={() => {}}
                                    className="mr-2 accent-custom-servcy"
                                />
                                <span className="text-sm font-normal">
                                    I agree to Servcys&nbsp;
                                    <Link
                                        className="text-custom-servcy"
                                        href="https://servcy.com/documents/privacy-policy/"
                                        target="_blank"
                                    >
                                        Privacy Policy
                                    </Link>
                                    &nbsp;&&nbsp;
                                    <Link
                                        className="text-custom-servcy"
                                        href="https://servcy.com/documents/terms-and-conditions"
                                        target="_blank"
                                    >
                                        Terms of Service
                                    </Link>
                                </span>
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-full"
                                size="md"
                                onClick={sendOtp}
                                disabled={loading}
                                loading={loading}
                            >
                                {!loading && <BiLogIn className="mr-2 inline" />} Send OTP
                            </Button>
                            <h2 className="servcy-hr-lines my-4">Or</h2>
                            <div className="flex place-content-center" id="servcy-google-login">
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
                                            <div className="h-10 w-10 animate-pulse rounded-full bg-custom-servcy-white" />
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
}
