import React, { useRef, useState } from "react"

import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"

import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { DeleteLabelModal } from "@components/labels"

import { useUser } from "@hooks/store"

import { PROJECT_SETTINGS_EMPTY_STATE_DETAILS } from "@constants/empty-state"

import { IIssueLabel } from "@servcy/types"
import { Button, Loader } from "@servcy/ui"

import { CreateUpdateLabelInline } from "./create-update-label-inline"
import { ProjectTemplateLabelItem } from "./project-label-item"

interface IProjectTemplateLabelList {
    labels: Partial<IIssueLabel>[]
    updateLabels: (labels: Partial<IIssueLabel>[]) => void
}

const ProjectTemplateLabelList: React.FC<IProjectTemplateLabelList> = observer((props) => {
    const { labels, updateLabels } = props
    // states
    const [showLabelForm, setLabelForm] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [selectDeleteLabel, setSelectDeleteLabel] = useState<IIssueLabel | null>(null)
    // refs
    const scrollToRef = useRef<HTMLFormElement>(null)
    // theme
    const { resolvedTheme } = useTheme()
    // store hooks
    const { currentUser } = useUser()
    // portal
    const newLabel = () => {
        setIsUpdating(false)
        setLabelForm(true)
    }
    const emptyStateDetail = PROJECT_SETTINGS_EMPTY_STATE_DETAILS["labels"]
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const emptyStateImage = getEmptyStateImagePath("project-settings", "labels", isLightMode)
    const addLabel = (label: Partial<IIssueLabel>) => {
        if (labels.some((label) => label.name === label.name)) return
        updateLabels([...labels, label])
    }
    const updateLabel = (data: Partial<IIssueLabel>) => {
        const index = labels.findIndex((label) => label.name === label.name)
        if (index === -1) return
        const updatedLabels = [...labels]
        updatedLabels[index] = data
        updateLabels(updatedLabels)
    }
    const deleteLabel = (labelName: string) => {
        updateLabels(labels.filter((l) => l.name !== labelName))
    }
    return (
        <>
            <DeleteLabelModal
                isOpen={!!selectDeleteLabel}
                data={selectDeleteLabel ?? null}
                onClose={() => setSelectDeleteLabel(null)}
            />
            <div className="flex items-center justify-between border-b border-custom-border-100 py-3.5">
                <h3 className="text-xl font-medium">Labels</h3>
                <Button variant="primary" onClick={newLabel} size="sm">
                    Add label
                </Button>
            </div>
            <div className="h-full w-full py-8">
                {showLabelForm && (
                    <div className="w-full rounded border border-custom-border-200 px-3.5 py-2 my-2">
                        <CreateUpdateLabelInline
                            labelForm={showLabelForm}
                            setLabelForm={setLabelForm}
                            addLabel={addLabel}
                            isUpdating={isUpdating}
                            ref={scrollToRef}
                            onClose={() => {
                                setLabelForm(false)
                                setIsUpdating(false)
                            }}
                        />
                    </div>
                )}
                {labels ? (
                    labels.length === 0 && !showLabelForm ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <EmptyState
                                title={emptyStateDetail.title}
                                description={emptyStateDetail.description}
                                image={emptyStateImage}
                                size="lg"
                            />
                        </div>
                    ) : (
                        labels &&
                        labels.map((label) => (
                            <div className="mt-3">
                                <ProjectTemplateLabelItem
                                    label={label}
                                    updateLabel={updateLabel}
                                    setIsUpdating={setIsUpdating}
                                    handleLabelDelete={(label) => deleteLabel(label)}
                                    isChild={false}
                                />
                            </div>
                        ))
                    )
                ) : (
                    !showLabelForm && (
                        <Loader className="space-y-5">
                            <Loader.Item height="42px" />
                            <Loader.Item height="42px" />
                            <Loader.Item height="42px" />
                            <Loader.Item height="42px" />
                        </Loader>
                    )
                )}
            </div>
        </>
    )
})

export default ProjectTemplateLabelList
