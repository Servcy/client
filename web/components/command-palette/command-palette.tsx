import { useParams, usePathname, useRouter } from "next/navigation"

import React, { FC, useCallback, useEffect } from "react"

import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"
import useSWR from "swr"

import { UpgradePlanModal } from "@components/billing"
import { CommandModal, ShortcutsModal } from "@components/command-palette"
import { BulkDeleteIssuesModal } from "@components/core"
import { CycleCreateUpdateModal } from "@components/cycles"
import { CreateUpdateIssueModal, DeleteIssueModal, StartTimeTrackerModal } from "@components/issues"
import { CreateUpdateModuleModal } from "@components/modules"
import { CreateUpdatePageModal } from "@components/pages"
import { CreateProjectModal } from "@components/project"
import { CreateUpdateProjectViewModal } from "@components/views"
import { CreateUpdateWorkspaceViewModal } from "@components/workspace"

import { useApplication, useEventTracker, useIssues, useTimeTracker, useUser } from "@hooks/store"

// fetch keys
import { ISSUE_DETAILS } from "@constants/fetch-keys"
import { EIssuesStoreType } from "@constants/issue"

import { IssueService } from "@services/issue"

import { copyTextToClipboard } from "@helpers/string.helper"

const issueService = new IssueService()

export const CommandPalette: FC = observer(() => {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const { workspaceSlug, projectId, issueId, cycleId, moduleId } = params

    const {
        commandPalette,
        theme: { toggleSidebar },
    } = useApplication()
    const { setTrackElement } = useEventTracker()
    const { currentUser } = useUser()
    const {
        issues: { removeIssue },
    } = useIssues(EIssuesStoreType.PROJECT)
    const { runningTimeTracker } = useTimeTracker()

    const {
        isUpgradePlanModalOpen,
        toggleUpgradePlanModal,
        toggleCommandPaletteModal,
        isCreateIssueModalOpen,
        toggleCreateIssueModal,
        isCreateCycleModalOpen,
        toggleCreateCycleModal,
        isCreatePageModalOpen,
        toggleCreatePageModal,
        isWorkspaceViewCreateModalOpen,
        toggleWorkspaceViewCreateModal,
        isCreateProjectModalOpen,
        toggleCreateProjectModal,
        isCreateModuleModalOpen,
        toggleCreateModuleModal,
        isCreateViewModalOpen,
        toggleCreateViewModal,
        isShortcutModalOpen,
        toggleShortcutModal,
        isBulkDeleteIssueModalOpen,
        toggleBulkDeleteIssueModal,
        isDeleteIssueModalOpen,
        toggleDeleteIssueModal,
        isTimeTrackerModalOpen,
        toggleTimeTrackerModal,
        isAnyModalOpen,
        createIssueStoreType,
    } = commandPalette

    const { data: issueDetails } = useSWR(
        workspaceSlug && projectId && issueId ? ISSUE_DETAILS(issueId as string) : null,
        workspaceSlug && projectId && issueId
            ? () => issueService.retrieve(workspaceSlug as string, projectId as string, issueId as string)
            : null
    )

    const copyIssueUrlToClipboard = useCallback(() => {
        if (!issueId) return

        const url = new URL(window.location.href)
        copyTextToClipboard(url.href)
            .then(() => {
                toast.success("Copied to clipboard")
            })
            .catch(() => {
                toast.error("Some error occurred")
            })
    }, [issueId])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const { key, ctrlKey, metaKey, altKey } = e
            if (!key) return

            const keyPressed = key.toLowerCase()
            const cmdClicked = ctrlKey || metaKey
            // if on input, textarea or editor, don't do anything
            if (
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLInputElement ||
                (e.target as Element).classList?.contains("ProseMirror")
            )
                return

            if (cmdClicked) {
                if (keyPressed === "k") {
                    e.preventDefault()
                    toggleCommandPaletteModal(true)
                } else if (keyPressed === "c" && altKey) {
                    e.preventDefault()
                    copyIssueUrlToClipboard()
                } else if (keyPressed === "b") {
                    e.preventDefault()
                    toggleSidebar()
                }
            } else if (!isAnyModalOpen) {
                setTrackElement("Shortcut key")
                if (keyPressed === "h") {
                    toggleShortcutModal(true)
                    return
                }
                if (!workspaceSlug) return
                if (keyPressed === "c") {
                    toggleCreateIssueModal(true)
                } else if (keyPressed === "p") {
                    toggleCreateProjectModal(true)
                } else if (keyPressed === "v") {
                    projectId ? toggleCreateViewModal(true) : toggleWorkspaceViewCreateModal(true)
                } else if (keyPressed === "d") {
                    toggleCreatePageModal(true)
                } else if (keyPressed === "q") {
                    toggleCreateCycleModal(true)
                } else if (keyPressed === "m") {
                    toggleCreateModuleModal(true)
                } else if (keyPressed === "t" && runningTimeTracker !== null) {
                    toggleTimeTrackerModal(true)
                } else if (keyPressed === "backspace" || keyPressed === "delete") {
                    e.preventDefault()
                    toggleBulkDeleteIssueModal(true)
                }
            }
        },
        [
            copyIssueUrlToClipboard,
            toggleCreateProjectModal,
            toggleCreateViewModal,
            toggleCreatePageModal,
            toggleShortcutModal,
            toggleCreateCycleModal,
            toggleCreateModuleModal,
            toggleBulkDeleteIssueModal,
            toggleCommandPaletteModal,
            toggleSidebar,
            toggleCreateIssueModal,
            projectId,
            workspaceSlug,
            isAnyModalOpen,
            setTrackElement,
        ]
    )

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    const isDraftIssue = pathname?.includes("draft-issues") || false

    if (!currentUser) return null

    return (
        <>
            <ShortcutsModal
                isOpen={isShortcutModalOpen}
                onClose={() => {
                    toggleShortcutModal(false)
                }}
            />
            {workspaceSlug && (
                <>
                    <UpgradePlanModal
                        isOpen={isUpgradePlanModalOpen}
                        onClose={() => {
                            toggleUpgradePlanModal(false)
                        }}
                    />
                    <CreateProjectModal
                        isOpen={isCreateProjectModalOpen}
                        onClose={() => {
                            toggleCreateProjectModal(false)
                        }}
                        workspaceSlug={workspaceSlug.toString()}
                    />
                    <CycleCreateUpdateModal
                        isOpen={isCreateCycleModalOpen}
                        handleClose={() => toggleCreateCycleModal(false)}
                        workspaceSlug={workspaceSlug.toString()}
                        projectId={projectId?.toString()}
                    />
                    <CreateUpdateModuleModal
                        isOpen={isCreateModuleModalOpen}
                        onClose={() => {
                            toggleCreateModuleModal(false)
                        }}
                        workspaceSlug={workspaceSlug.toString()}
                        projectId={projectId?.toString()}
                    />
                    <CreateUpdatePageModal
                        isOpen={isCreatePageModalOpen}
                        handleClose={() => toggleCreatePageModal(false)}
                        projectId={projectId?.toString()}
                    />
                    <CreateUpdateIssueModal
                        isOpen={isCreateIssueModalOpen}
                        onClose={() => toggleCreateIssueModal(false)}
                        data={
                            cycleId
                                ? { cycle_id: cycleId.toString() }
                                : moduleId
                                  ? { module_ids: [moduleId.toString()] }
                                  : undefined
                        }
                        storeType={createIssueStoreType}
                        isDraft={isDraftIssue}
                    />
                    <BulkDeleteIssuesModal
                        isOpen={isBulkDeleteIssueModalOpen}
                        onClose={() => {
                            toggleBulkDeleteIssueModal(false)
                        }}
                        user={currentUser}
                    />
                    <CreateUpdateWorkspaceViewModal
                        isOpen={isWorkspaceViewCreateModalOpen}
                        onClose={() => {
                            toggleWorkspaceViewCreateModal(false)
                        }}
                    />
                    <StartTimeTrackerModal
                        handleClose={() => toggleTimeTrackerModal(false)}
                        isOpen={isTimeTrackerModalOpen}
                    />
                </>
            )}
            {workspaceSlug && projectId && (
                <CreateUpdateProjectViewModal
                    isOpen={isCreateViewModalOpen}
                    onClose={() => toggleCreateViewModal(false)}
                    workspaceSlug={workspaceSlug.toString()}
                    projectId={projectId.toString()}
                />
            )}
            {workspaceSlug && projectId && issueId && issueDetails && (
                <DeleteIssueModal
                    handleClose={() => toggleDeleteIssueModal(false)}
                    isOpen={isDeleteIssueModalOpen}
                    data={issueDetails}
                    onSubmit={async () => {
                        await removeIssue(workspaceSlug.toString(), projectId.toString(), issueId.toString())
                        router.push(`/${workspaceSlug}/projects/${projectId}/issues`)
                    }}
                />
            )}
            <CommandModal />
        </>
    )
})
