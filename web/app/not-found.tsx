"use client"

import { CiWarning } from "react-icons/ci"

export default function NotFound(): JSX.Element {
    return (
        <main className="order-2 m-auto p-24">
            <div className="flex flex-col items-center justify-center">
                <CiWarning className="h-32 w-32 text-servcy-silver" />
                <h1 className="text-4xl font-bold text-servcy-silver">404</h1>
                <p className="mt-2 text-servcy-silver">
                    Page not found. Please check the URL in the address bar and try again.
                </p>
            </div>
        </main>
    )
}
