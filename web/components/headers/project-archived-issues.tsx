import { useParams, useRouter } from "next/navigation"

import { FC } from "react"

import { ArrowLeft } from "lucide-react"
import { observer } from "mobx-react-lite"

import { BreadcrumbLink } from "@components/common"
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"

import { useIssues, useProject } from "@hooks/store"

import { EIssuesStoreType } from "@constants/issue"

import { renderEmoji } from "@helpers/emoji.helper"

import { Breadcrumbs, LayersIcon, Tooltip } from "@servcy/ui"

export const ProjectArchivedIssuesHeader: FC = observer(() => {
    const router = useRouter()
    const { workspaceSlug } = useParams()
    // store hooks
    const {
        issuesFilter: { issueFilters },
    } = useIssues(EIssuesStoreType.ARCHIVED)
    const { currentProjectDetails } = useProject()

    const issueCount = currentProjectDetails
        ? issueFilters?.displayFilters?.sub_issue
            ? currentProjectDetails.archived_issues + currentProjectDetails.archived_sub_issues
            : currentProjectDetails.archived_issues
        : undefined

    return (
        <div className="relative z-10 flex h-14 w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
            <div className="flex w-full flex-grow items-center gap-2 overflow-ellipsis whitespace-nowrap">
                <SidebarHamburgerToggle />
                <div className="block md:hidden">
                    <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded border border-custom-border-200"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft fontSize={14} strokeWidth={2} />
                    </button>
                </div>
                <div className="flex items-center gap-2.5">
                    <Breadcrumbs>
                        <Breadcrumbs.BreadcrumbItem
                            type="text"
                            link={
                                <BreadcrumbLink
                                    href={`/${workspaceSlug}/projects`}
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
                                    label="Archived issues"
                                    icon={<LayersIcon className="h-4 w-4 text-custom-text-300" />}
                                />
                            }
                        />
                    </Breadcrumbs>
                    {issueCount && issueCount > 0 ? (
                        <Tooltip
                            tooltipContent={`There are ${issueCount} ${issueCount > 1 ? "issues" : "issue"} in project's archived`}
                            position="bottom"
                        >
                            <span className="cursor-default flex items-center text-center justify-center px-2.5 py-0.5 flex-shrink-0 bg-custom-primary-100/20 text-custom-primary-100 text-xs font-semibold rounded-xl">
                                {issueCount}
                            </span>
                        </Tooltip>
                    ) : null}
                </div>
            </div>
        </div>
    )
})
