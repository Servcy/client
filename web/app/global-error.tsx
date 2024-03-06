"use client"

import { useRouter } from "next/router"

import toast from "react-hot-toast"

import DefaultLayout from "@layouts/DefaultLayout"

import { AuthService } from "@services/auth.service"

import { Button } from "@servcy/ui"

const authService = new AuthService()

const CustomErrorComponent = () => {
    const router = useRouter()

    const logOut = async () => {
        await authService
            .logOut()
            .catch(() => toast.error("Failed to sign out. Please try again."))
            .finally(() => router.push("/"))
    }

    return (
        <DefaultLayout>
            <div className="grid h-full place-items-center p-4">
                <div className="space-y-8 text-center">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Exception Detected!</h3>
                        <p className="mx-auto w-1/2 text-sm text-custom-text-200">
                            We{"'"}re Sorry! An exception has been detected, and our engineering team has been notified.
                            We apologize for any inconvenience this may have caused. Please reach out to our engineering
                            team at{" "}
                            <a href="mailto:contact@servcy.com" className="text-custom-primary">
                                contact@servcy.com
                            </a>
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="primary" size="md" onClick={() => router.reload()}>
                            Refresh
                        </Button>
                        <Button variant="neutral-primary" size="md" onClick={logOut}>
                            Sign out
                        </Button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default CustomErrorComponent
