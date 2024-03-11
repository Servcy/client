import Link from "next/link"
import { usePathname } from "next/navigation"

import { FC, ReactNode } from "react"

import { ChevronDown } from "lucide-react"

import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"

import { useApplication } from "@hooks/store"

// layout
import { ProfileSettingsWrapper } from "@wrappers/settings"

import { CustomMenu } from "@servcy/ui"

import { ProfilePreferenceSettingsSidebar } from "./sidebar"

interface IProfilePreferenceSettingsLayout {
    children: ReactNode
    header?: ReactNode
}

export const ProfilePreferenceSettingsWrapper: FC<IProfilePreferenceSettingsLayout> = (props) => {
    const { children, header } = props
    const pathname = usePathname()
    const { theme: themeStore } = useApplication()

    const showMenuItem = () => {
        const item = pathname.split("/")
        let splittedItem = item[item.length - 1]
        splittedItem = splittedItem?.replace(splittedItem[0] ?? "", (splittedItem[0] ?? "").toUpperCase())
        return splittedItem
    }

    const profilePreferenceLinks: Array<{
        label: string
        href: string
    }> = [
        {
            label: "Theme",
            href: `/profile/preferences/theme`,
        },
        {
            label: "Email",
            href: `/profile/preferences/email`,
        },
    ]

    return (
        <ProfileSettingsWrapper
            header={
                <div className="md:hidden flex flex-shrink-0 gap-4 items-center justify-start border-b border-custom-border-200 p-4">
                    <SidebarHamburgerToggle onClick={() => themeStore.toggleSidebar()} />
                    <CustomMenu
                        maxHeight={"md"}
                        className="flex flex-grow justify-center text-custom-text-200 text-sm"
                        placement="bottom-start"
                        customButton={
                            <div className="flex gap-2 items-center px-2 py-1.5 border rounded-md border-custom-border-400">
                                <span className="flex flex-grow justify-center text-custom-text-200 text-sm">
                                    {showMenuItem()}
                                </span>
                                <ChevronDown className="w-4 h-4 text-custom-text-400" />
                            </div>
                        }
                        customButtonClassName="flex flex-grow justify-start text-custom-text-200 text-sm"
                    >
                        <></>
                        {profilePreferenceLinks.map((link) => (
                            <CustomMenu.MenuItem className="flex items-center gap-2">
                                <Link key={link.href} href={link.href} className="text-custom-text-300 w-full">
                                    {link.label}
                                </Link>
                            </CustomMenu.MenuItem>
                        ))}
                    </CustomMenu>
                </div>
            }
        >
            <div className="relative flex h-screen w-full overflow-hidden">
                <ProfilePreferenceSettingsSidebar />
                <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
                    {header}
                    <div className="h-full w-full overflow-x-hidden overflow-y-scroll">{children}</div>
                </main>
            </div>
        </ProfileSettingsWrapper>
    )
}
