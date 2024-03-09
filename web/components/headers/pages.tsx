import { useParams } from "next/navigation"

import { FileText, Plus } from "lucide-react"
import { observer } from "mobx-react-lite"

import { BreadcrumbLink } from "@components/common"
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"

import { useApplication, useEventTracker, useProject, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { renderEmoji } from "@helpers/emoji.helper"

import { Breadcrumbs, Button } from "@servcy/ui"

export const PagesHeader = observer(() => {
    const { workspaceSlug } = useParams()
    // store hooks
    const {
        commandPalette: { toggleCreatePageModal },
    } = useApplication()
    const {
        membership: { currentProjectRole },
    } = useUser()
    const { currentProjectDetails } = useProject()
    const { setTrackElement } = useEventTracker()

    const canUserCreatePage = currentProjectRole && [ERoles.ADMIN, ERoles.MEMBER].includes(currentProjectRole)

    return (
        <div className="relative z-10 flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
            <div className="flex w-full flex-grow items-center gap-2 overflow-ellipsis whitespace-nowrap">
                <SidebarHamburgerToggle />
                <div>
                    <Breadcrumbs>
                        <Breadcrumbs.BreadcrumbItem
                            type="text"
                            link={
                                <BreadcrumbLink
                                    href={`/${workspaceSlug}/projects/${currentProjectDetails?.id}/issues`}
                                    label={currentProjectDetails?.name ?? "Project"}
                                    icon={
                                        currentProjectDetails?.emoji ? (
                                            renderEmoji(currentProjectDetails.emoji)
                                        ) : currentProjectDetails?.icon_prop ? (
                                            renderEmoji(currentProjectDetails.icon_prop)
                                        ) : (
                                            <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded bg-gray-700 uppercase text-white">
                                                {currentProjectDetails?.name.charAt(0)}
                                            </span>
                                        )
                                    }
                                />
                            }
                        />
                        <Breadcrumbs.BreadcrumbItem
                            type="text"
                            link={
                                <BreadcrumbLink
                                    label="Pages"
                                    icon={<FileText className="h-4 w-4 text-custom-text-300" />}
                                />
                            }
                        />
                    </Breadcrumbs>
                </div>
            </div>
            {canUserCreatePage && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        prependIcon={<Plus />}
                        size="sm"
                        onClick={() => {
                            setTrackElement("Project pages page")
                            toggleCreatePageModal(true)
                        }}
                    >
                        Create Page
                    </Button>
                </div>
            )}
        </div>
    )
})
