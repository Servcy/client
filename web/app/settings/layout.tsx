"use client"

import { useEffect, useState } from "react"

import { AiFillApi, AiOutlineArrowRight, AiOutlineSetting } from "react-icons/ai"

import { getQueryParams } from "@helpers/common.helper"

export default function SettingsLayout({ integrations }: { integrations: React.ReactNode }) {
    const [selection, setSelection] = useState<string>("integrations")

    useEffect(() => {
        const queryParams: Record<string, string> = getQueryParams(window.location.search)
        if (queryParams["selection"]) {
            setSelection(queryParams["selection"])
        }
    }, [])

    return (
        <>
            <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
                <div className="flex flex-row">
                    <AiOutlineSetting size="24" className="my-auto mr-2" />
                    <p className="text-xl">Settings</p>
                </div>
            </header>
            <div className="flex gap-4 overflow-y-hidden">
                <div className="w-56 flex-none rounded-lg bg-servcy-white p-6">
                    <div className="flex flex-col gap-4 font-semibold">
                        <div className="servcy-small-title flex flex-row items-center gap-2 text-xs text-servcy-neutral">
                            Quick Access Menu
                        </div>
                        <hr className="h-[1.5px] border-none bg-servcy-wheat" />
                        <div className="flex flex-col gap-4 text-sm text-servcy-neutral">
                            <button
                                onClick={() => {
                                    setSelection("integrations")
                                }}
                                className="border-1 flex cursor-pointer flex-row rounded-lg border-servcy-black p-2 hover:border-none hover:bg-servcy-wheat hover:text-servcy-black"
                            >
                                <AiFillApi size="18" className="my-auto mr-2" />
                                <p>Integrations</p>
                                <AiOutlineArrowRight size="16" className="my-auto ml-auto" />
                            </button>
                        </div>
                    </div>
                </div>
                {selection === "integrations" && integrations}
            </div>
        </>
    )
}
