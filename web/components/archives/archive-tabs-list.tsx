import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { FC } from "react"

import { observer } from "mobx-react"

import { useProject } from "@hooks/store"

import { ARCHIVES_TAB_LIST } from "@constants/archives"

export const ArchiveTabsList: FC = observer(() => {
    const { workspaceSlug, projectId } = useParams()
    const pathname = usePathname()
    const activeTab = pathname.split("/").pop()
    const { getProjectById } = useProject()
    if (!projectId) return null
    const projectDetails = getProjectById(projectId?.toString())
    if (!projectDetails) return null

    return (
        <>
            {ARCHIVES_TAB_LIST.map(
                (tab) =>
                    tab.shouldRender(projectDetails) && (
                        <Link key={tab.key} href={`/${workspaceSlug}/projects/${projectId}/archives/${tab.key}`}>
                            <span
                                className={`flex min-w-min flex-shrink-0 whitespace-nowrap border-b-2 py-3 px-4 text-sm font-medium outline-none ${
                                    tab.key === activeTab
                                        ? "border-custom-primary-100 text-custom-primary-100"
                                        : "border-transparent hover:border-custom-border-200 text-custom-text-300 hover:text-custom-text-400"
                                }`}
                            >
                                {tab.label}
                            </span>
                        </Link>
                    )
            )}
        </>
    )
})
