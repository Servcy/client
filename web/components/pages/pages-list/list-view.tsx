import { useRouter } from "next/navigation"

import { FC } from "react"

import { useTheme } from "next-themes"

import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"

import { useApplication, useUser } from "@hooks/store"
import useLocalStorage from "@hooks/use-local-storage"

import { PAGE_EMPTY_STATE_DETAILS } from "@constants/empty-state"
import { EUserProjectRoles } from "@constants/project"

import { Loader } from "@servcy/ui"

import { PagesListItem } from "./list-item"

type IPagesListView = {
    pageIds: string[]
}

export const PagesListView: FC<IPagesListView> = (props) => {
    const { pageIds: projectPageIds } = props
    // theme
    const { resolvedTheme } = useTheme()
    // store hooks
    const {
        commandPalette: { toggleCreatePageModal },
    } = useApplication()
    const {
        membership: { currentProjectRole },
        currentUser,
    } = useUser()
    // local storage
    const { storedValue: pageTab } = useLocalStorage("pageTab", "Recent")
    // router
    const router = useRouter()
    const { workspaceSlug, projectId } = router.query

    const currentPageTabDetails = pageTab
        ? PAGE_EMPTY_STATE_DETAILS[pageTab as keyof typeof PAGE_EMPTY_STATE_DETAILS]
        : PAGE_EMPTY_STATE_DETAILS["All"]

    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const emptyStateImage = getEmptyStateImagePath("pages", currentPageTabDetails.key, isLightMode)

    const isButtonVisible = currentPageTabDetails.key !== "archived" && currentPageTabDetails.key !== "favorites"

    // here we are only observing the projectPageStore, so that we can re-render the component when the projectPageStore changes

    const isEditingAllowed = !!currentProjectRole && currentProjectRole >= EUserProjectRoles.MEMBER

    return (
        <>
            {projectPageIds && workspaceSlug && projectId ? (
                <div className="h-full space-y-4 overflow-y-auto vertical-scrollbar scrollbar-lg">
                    {projectPageIds.length > 0 ? (
                        <ul role="list" className="divide-y divide-custom-border-200">
                            {projectPageIds.map((pageId: string) => (
                                <PagesListItem key={pageId} pageId={pageId} projectId={projectId.toString()} />
                            ))}
                        </ul>
                    ) : (
                        <EmptyState
                            title={currentPageTabDetails.title}
                            description={currentPageTabDetails.description}
                            image={emptyStateImage}
                            primaryButton={
                                isButtonVisible
                                    ? {
                                          text: "Create new page",
                                          onClick: () => toggleCreatePageModal(true),
                                      }
                                    : undefined
                            }
                            disabled={!isEditingAllowed}
                        />
                    )}
                </div>
            ) : (
                <Loader className="space-y-4">
                    <Loader.Item height="40px" />
                    <Loader.Item height="40px" />
                    <Loader.Item height="40px" />
                </Loader>
            )}
        </>
    )
}
