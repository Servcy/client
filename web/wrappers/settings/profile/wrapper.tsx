import { FC, ReactNode } from "react"

import { CommandPalette } from "@components/command-palette"

import { ProfileLayoutSidebar } from "@wrappers/settings"
import UserAuthWrapper from "@wrappers/UserAuthWrapper"

interface IProfileSettingsLayout {
    children: ReactNode
    header?: ReactNode
}

export const ProfileSettingsWrapper: FC<IProfileSettingsLayout> = (props) => {
    const { children, header } = props

    return (
        <>
            <CommandPalette />
            <UserAuthWrapper>
                <div className="relative flex h-screen w-full overflow-hidden">
                    <ProfileLayoutSidebar />
                    <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
                        {header}
                        <div className="h-full w-full overflow-x-hidden overflow-y-scroll">{children}</div>
                    </main>
                </div>
            </UserAuthWrapper>
        </>
    )
}
