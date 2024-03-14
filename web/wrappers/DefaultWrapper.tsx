import Link from "next/link"
import { useRouter } from "next/navigation"

import { FC, Fragment, ReactNode, useEffect, useRef, useState } from "react"

import { Menu, Transition } from "@headlessui/react"
import { ChevronDown, Home, Inbox, LogOut, Mails, MoveLeft, Plus, Settings, Workflow } from "lucide-react"
import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import toast from "react-hot-toast"
import { mutate } from "swr"

import { CommandPalette } from "@components/command-palette"

import { useApplication, useUser, useWorkspace } from "@hooks/store"
import useOutsideClickDetector from "@hooks/use-outside-click-detector"

import UserAuthWrapper from "@wrappers/auth/UserAuthWrapper"

import { IWorkspace } from "@servcy/types"
import { Avatar, Tooltip } from "@servcy/ui"

const WORKSPACE_ACTION_LINKS = [
    {
        key: "workspace-create",
        Icon: Plus,
        label: "Create workspace",
        href: "/workspace/create",
    },
    {
        key: "invitations",
        Icon: Mails,
        label: "Invitations",
        href: "/invitations",
    },
]

const HOME_ACTION_LINKS = [
    {
        key: "home",
        Icon: Home,
        label: "Home",
        href: "/",
    },
    {
        key: "integrations",
        Icon: Workflow,
        label: "Integrations",
        href: "/integrations",
    },
    {
        key: "inbox",
        Icon: Inbox,
        label: "Inbox",
        href: "/inbox",
    },
]

const USER_LINKS = () => [
    {
        key: "settings",
        name: "Settings",
        href: `/profile`,
        icon: Settings,
    },
]

interface INoWorkspaceWrapper {
    children: ReactNode
    header?: ReactNode
}

const DefaultWrapper: FC<INoWorkspaceWrapper> = observer((props) => {
    const { children, header } = props
    const [isSigningOut, setIsSigningOut] = useState(false)
    const router = useRouter()
    const { setTheme } = useTheme()
    const {
        theme: { sidebarCollapsed, toggleSidebar },
    } = useApplication()
    const { logOut, updateCurrentUser, currentUser } = useUser()
    const { workspaces } = useWorkspace()
    const workspacesList = Object.values(workspaces ?? {})
    const ref = useRef<HTMLDivElement>(null)

    useOutsideClickDetector(ref, () => {
        if (sidebarCollapsed === false) {
            if (window.innerWidth < 768) {
                toggleSidebar()
            }
        }
    })

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                toggleSidebar(true)
            }
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [toggleSidebar])

    const handleItemClick = () => {
        if (window.innerWidth < 768) {
            toggleSidebar()
        }
    }

    const handleSignOut = async () => {
        setIsSigningOut(true)
        await logOut()
            .then(() => {
                mutate("CURRENT_USER_DETAILS", null)
                setTheme("system")
                router.push("/")
            })
            .catch(() => toast.error("Failed to sign out. Please try again."))
            .finally(() => setIsSigningOut(false))
    }

    const handleWorkspaceNavigation = (workspace: IWorkspace) =>
        updateCurrentUser({
            last_workspace_id: workspace?.id,
        })

    return (
        <>
            <CommandPalette />
            <UserAuthWrapper>
                <div className="relative flex h-screen w-full overflow-hidden">
                    <div
                        className={`fixed inset-y-0 z-20 flex h-full flex-shrink-0 flex-grow-0 flex-col border-r border-custom-sidebar-border-200 bg-custom-sidebar-background-100 duration-300 md:relative 
                                    ${sidebarCollapsed ? "-ml-[280px]" : ""}
                                    sm:${sidebarCollapsed ? "-ml-[280px]" : ""}
                                    md:ml-0 ${sidebarCollapsed ? "w-[80px]" : "w-[280px]"}
                                    lg:ml-0 ${sidebarCollapsed ? "w-[80px]" : "w-[280px]"}
                        `}
                    >
                        <div className="flex items-center gap-x-3 gap-y-2 px-4 pt-4">
                            <Menu as="div" className="relative h-full flex-grow truncate text-left">
                                {({ open }) => (
                                    <>
                                        <Menu.Button className="group/menu-button h-full w-full truncate rounded-md text-sm font-medium text-custom-sidebar-text-200 hover:bg-custom-sidebar-background-80 focus:outline-none">
                                            <div
                                                className={`flex items-center  gap-x-2 truncate rounded p-1 ${
                                                    sidebarCollapsed ? "justify-center" : "justify-between"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <div
                                                        className={`relative grid h-6 w-6 flex-shrink-0 place-items-center uppercase ${
                                                            !currentUser?.avatar &&
                                                            "rounded bg-custom-primary-500 text-white"
                                                        }`}
                                                    >
                                                        {currentUser?.avatar && currentUser.avatar !== "" ? (
                                                            <Avatar
                                                                name={currentUser?.display_name}
                                                                src={currentUser?.avatar}
                                                                className="!text-base"
                                                                size={24}
                                                                shape="square"
                                                            />
                                                        ) : (
                                                            currentUser?.display_name?.charAt(0) ?? "..."
                                                        )}
                                                    </div>
                                                    {!sidebarCollapsed && (
                                                        <h4 className="truncate text-base font-medium text-custom-text-100">
                                                            {currentUser?.display_name
                                                                ? currentUser.display_name
                                                                : "Loading..."}
                                                        </h4>
                                                    )}
                                                </div>
                                                {!sidebarCollapsed && (
                                                    <ChevronDown
                                                        className={`mx-1 hidden h-4 w-4 flex-shrink-0 group-hover/menu-button:block ${
                                                            open ? "rotate-180" : ""
                                                        } text-custom-sidebar-text-400 duration-300`}
                                                    />
                                                )}
                                            </div>
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items as={Fragment}>
                                                <div className="fixed left-4 z-20 mt-1 flex w-full max-w-[19rem] origin-top-left flex-col rounded-md border-[0.5px] border-custom-sidebar-border-300 bg-custom-sidebar-background-100 shadow-custom-shadow-rg divide-y divide-custom-border-100 outline-none">
                                                    <div className="flex max-h-96 flex-col items-start justify-start gap-2 overflow-y-scroll mb-2 px-4 vertical-scrollbar scrollbar-sm">
                                                        <h6 className="sticky top-0 z-10 h-full w-full pt-3 pb-1 text-sm font-medium text-custom-sidebar-text-400 bg-custom-sidebar-background-100">
                                                            {currentUser?.email}
                                                        </h6>
                                                    </div>
                                                    <div className="flex w-full flex-col items-start justify-start gap-2 px-4 py-2 text-sm">
                                                        {USER_LINKS().map((link, index) => (
                                                            <Link
                                                                key={link.key}
                                                                href={link.href}
                                                                className="w-full"
                                                                onClick={() => {
                                                                    if (index > 0) handleItemClick()
                                                                }}
                                                            >
                                                                <Menu.Item
                                                                    as="div"
                                                                    className="flex items-center gap-2 rounded px-2 py-1 text-sm text-custom-sidebar-text-200 hover:bg-custom-sidebar-background-80 font-medium"
                                                                >
                                                                    <link.icon className="h-4 w-4 flex-shrink-0" />
                                                                    {link.name}
                                                                </Menu.Item>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <div className="w-full px-4 py-2">
                                                        <Menu.Item
                                                            as="button"
                                                            type="button"
                                                            className="w-full flex items-center gap-2 rounded px-2 py-1 text-sm text-red-600 hover:bg-custom-sidebar-background-80 font-medium"
                                                            onClick={handleSignOut}
                                                        >
                                                            <LogOut className="h-4 w-4 flex-shrink-0" />
                                                            Sign out
                                                        </Menu.Item>
                                                    </div>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </>
                                )}
                            </Menu>
                        </div>
                        <div ref={ref} className="flex h-full w-full flex-col gap-y-4 mt-4">
                            <div className="flex flex-shrink-0 flex-col overflow-x-hidden px-4">
                                {!sidebarCollapsed && (
                                    <h6 className="rounded px-1.5 text-sm font-semibold text-custom-sidebar-text-400">
                                        Your Space
                                    </h6>
                                )}
                                <div className="mt-2 h-full space-y-1.5 overflow-y-auto">
                                    {HOME_ACTION_LINKS.map((link) => (
                                        <Link
                                            key={link.key}
                                            href={link.href}
                                            className="block w-full"
                                            onClick={handleItemClick}
                                        >
                                            <Tooltip
                                                tooltipContent={link.label}
                                                position="right"
                                                className="ml-2"
                                                disabled={!sidebarCollapsed}
                                            >
                                                <div
                                                    className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium outline-none text-custom-sidebar-text-200 hover:bg-custom-sidebar-background-80 ${sidebarCollapsed ? "justify-center" : ""}`}
                                                >
                                                    {<link.Icon className="h-4 w-4" />}
                                                    {!sidebarCollapsed && link.label}
                                                </div>
                                            </Tooltip>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col overflow-x-hidden px-4">
                                {!sidebarCollapsed && (
                                    <h6 className="rounded px-1.5 text-sm font-semibold text-custom-sidebar-text-400">
                                        Workspaces
                                    </h6>
                                )}
                                {workspacesList && workspacesList.length > 0 && (
                                    <div className="mt-2 h-full space-y-1.5 overflow-y-auto">
                                        {workspacesList.map((workspace) => (
                                            <Link
                                                key={workspace.id}
                                                href={`/${workspace.slug}`}
                                                className={`flex flex-grow cursor-pointer select-none items-center truncate text-left text-sm font-medium ${
                                                    sidebarCollapsed ? "justify-center" : `justify-between`
                                                }`}
                                                onClick={() => {
                                                    handleWorkspaceNavigation(workspace)
                                                    handleItemClick()
                                                }}
                                            >
                                                <span
                                                    className={`flex w-full flex-grow items-center gap-x-2 truncate rounded-md px-3 py-1 hover:bg-custom-sidebar-background-80 ${
                                                        sidebarCollapsed ? "justify-center" : ""
                                                    }`}
                                                >
                                                    <span
                                                        className={`relative flex h-6 w-6 flex-shrink-0 items-center  justify-center p-2 text-xs uppercase ${
                                                            !workspace?.logo &&
                                                            "rounded bg-custom-primary-500 text-white"
                                                        }`}
                                                    >
                                                        {workspace?.logo && workspace.logo !== "" ? (
                                                            <img
                                                                src={workspace.logo}
                                                                className="absolute left-0 top-0 h-full w-full rounded object-cover"
                                                                alt="Workspace Logo"
                                                            />
                                                        ) : (
                                                            workspace?.name?.charAt(0) ?? "..."
                                                        )}
                                                    </span>
                                                    {!sidebarCollapsed && (
                                                        <p className="truncate text-sm text-custom-sidebar-text-200">
                                                            {workspace.name}
                                                        </p>
                                                    )}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-1.5">
                                    {WORKSPACE_ACTION_LINKS.map((link) => (
                                        <Link
                                            className="block w-full"
                                            key={link.key}
                                            href={link.href}
                                            onClick={handleItemClick}
                                        >
                                            <Tooltip
                                                tooltipContent={link.label}
                                                position="right"
                                                className="ml-2"
                                                disabled={!sidebarCollapsed}
                                            >
                                                <div
                                                    className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-custom-sidebar-text-200 outline-none hover:bg-custom-sidebar-background-80 focus:bg-custom-sidebar-background-80 ${
                                                        sidebarCollapsed ? "justify-center" : ""
                                                    }`}
                                                >
                                                    {<link.Icon className="h-4 w-4" />}
                                                    {!sidebarCollapsed && link.label}
                                                </div>
                                            </Tooltip>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-shrink-0 flex-grow items-end px-6 py-2">
                                <div
                                    className={`flex w-full ${
                                        sidebarCollapsed
                                            ? "flex-col justify-center gap-2"
                                            : "items-center justify-between gap-2"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex items-center justify-center gap-2 text-sm font-medium text-red-500"
                                        disabled={isSigningOut}
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        {!sidebarCollapsed && (
                                            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="grid place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 md:hidden"
                                        onClick={() => toggleSidebar()}
                                    >
                                        <MoveLeft className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        className={`ml-auto hidden place-items-center rounded-md p-1.5 text-custom-text-200 outline-none hover:bg-custom-background-90 hover:text-custom-text-100 md:grid ${
                                            sidebarCollapsed ? "w-full" : ""
                                        }`}
                                        onClick={() => toggleSidebar()}
                                    >
                                        <MoveLeft
                                            className={`h-3.5 w-3.5 duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
                        {header}
                        <div className="h-full w-full overflow-x-hidden overflow-y-scroll">{children}</div>
                    </main>
                </div>
            </UserAuthWrapper>
        </>
    )
})

export default DefaultWrapper
