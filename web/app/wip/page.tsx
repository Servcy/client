"use client"

import { TbBarrierBlock } from "react-icons/tb"

export default function WIP(): JSX.Element {
    return (
        <>
            <div className="flex h-full flex-col items-center justify-center">
                <TbBarrierBlock className="h-32 w-32 text-servcy-black" />
                <p className="mt-2 text-servcy-black">
                    Oops... this is still a work in progress. Please check back later.
                </p>
            </div>
        </>
    )
}
