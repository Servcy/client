import { useParams, useRouter } from "next/navigation"

import { FC } from "react"

import { Plus } from "lucide-react"
import { observer } from "mobx-react-lite"

import { BreadcrumbLink } from "@components/common"

import { useApplication, useEventTracker, useProject, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { renderEmoji } from "@helpers/emoji.helper"

import { Breadcrumbs, Button, ContrastIcon } from "@servcy/ui"

export const CyclesHeader: FC = observer(() => {
    const router = useRouter()
    const { workspaceSlug } = useParams()
    // store hooks
    const {
        commandPalette: { toggleCreateCycleModal },
    } = useApplication()
    const { setTrackElement } = useEventTracker()
    const {
        membership: { currentProjectRole },
    } = useUser()
    const { currentProjectDetails } = useProject()

    const canUserCreateCycle = currentProjectRole && [ERoles.ADMIN, ERoles.MEMBER].includes(currentProjectRole)

    return (
        <div className="relative z-10 items-center justify-between gap-x-2 gap-y-4">
            <div className="flex bg-custom-sidebar-background-100 p-4">
                <div className="flex w-full flex-grow items-center gap-2 overflow-ellipsis whitespace-nowrap">
                    <div>
                        <Breadcrumbs onBack={router.back}>
                            <Breadcrumbs.BreadcrumbItem
                                type="text"
                                link={
                                    <BreadcrumbLink
                                        label={currentProjectDetails?.name ?? "Project"}
                                        href={`/${workspaceSlug}/projects/${currentProjectDetails?.id}/issues`}
                                        icon={
                                            currentProjectDetails?.emoji ? (
                                                renderEmoji(currentProjectDetails.emoji)
                                            ) : currentProjectDetails?.icon_prop ? (
                                                renderEmoji(currentProjectDetails.icon_prop)
                                            ) : (
                                                <span className="flex h-4 w-4 items-center justify-center rounded bg-gray-700 uppercase text-white">
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
                                        label="Cycles"
                                        icon={<ContrastIcon className="h-4 w-4 text-custom-text-300" />}
                                    />
                                }
                            />
                        </Breadcrumbs>
                    </div>
                </div>
                {canUserCreateCycle && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            size="sm"
                            prependIcon={<Plus />}
                            onClick={() => {
                                setTrackElement("Cycles page")
                                toggleCreateCycleModal(true)
                            }}
                        >
                            <div className="hidden sm:block">Add</div> Cycle
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
})
