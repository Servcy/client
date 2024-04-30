import { useParams } from "next/navigation"

import { FC } from "react"

import { FileText } from "lucide-react"
import { observer } from "mobx-react-lite"

import { useEventTracker, useProject, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { IProject } from "@servcy/types"
import { ContrastIcon, DiceIcon, PhotoFilterIcon, ToggleSwitch } from "@servcy/ui"

type Props = {}

const PROJECT_FEATURES_LIST = [
    {
        title: "Cycles",
        description: "Time-box issues and boost momentum, similar to sprints in scrum.",
        icon: <ContrastIcon className="h-4 w-4 flex-shrink-0 rotate-180 text-purple-500" />,
        property: "cycle_view",
    },
    {
        title: "Modules",
        description: "Group multiple issues together and track the progress.",
        icon: <DiceIcon width={16} height={16} className="flex-shrink-0 text-red-500" />,
        property: "module_view",
    },
    {
        title: "Views",
        description: "Apply filters to issues and save them to analyse and investigate work.",
        icon: <PhotoFilterIcon className="h-4 w-4 flex-shrink-0 text-cyan-500" />,
        property: "issue_views_view",
    },
    {
        title: "Pages",
        description: "Document ideas, feature requirements, discussions within your project.",
        icon: <FileText className="h-4 w-4 flex-shrink-0 text-red-400" />,
        property: "page_view",
    },
]

export const ProjectFeaturesList: FC<Props> = observer(() => {
    const { workspaceSlug, projectId } = useParams()
    // store hooks
    const { captureEvent } = useEventTracker()
    const {
        currentUser,
        membership: { currentProjectRole },
    } = useUser()
    const { currentProjectDetails, updateProject } = useProject()
    const isAdmin = currentProjectRole !== undefined && currentProjectRole > ERoles.MEMBER

    const handleSubmit = async (formData: Partial<IProject>) => {
        if (!workspaceSlug || !projectId || !currentProjectDetails) return
        updateProject(workspaceSlug.toString(), projectId.toString(), formData)
    }

    if (!currentUser) return <></>

    return (
        <div>
            {PROJECT_FEATURES_LIST.map((feature) => (
                <div
                    key={feature.property}
                    className="flex items-center justify-between gap-x-8 gap-y-2 border-b border-custom-border-100 bg-custom-background-100 p-4"
                >
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center rounded bg-custom-background-90 p-3">
                            {feature.icon}
                        </div>
                        <div className="">
                            <h4 className="text-sm font-medium">{feature.title}</h4>
                            <p className="text-sm tracking-tight text-custom-text-200">{feature.description}</p>
                        </div>
                    </div>
                    <ToggleSwitch
                        value={Boolean(currentProjectDetails?.[feature.property as keyof IProject])}
                        onChange={() => {
                            captureEvent(`Toggle ${feature.title.toLowerCase()}`, {
                                enabled: !currentProjectDetails?.[feature.property as keyof IProject],
                                element: "Project settings feature page",
                            })
                            handleSubmit({
                                [feature.property]: !currentProjectDetails?.[feature.property as keyof IProject],
                            })
                        }}
                        disabled={!isAdmin}
                        size="sm"
                    />
                </div>
            ))}
        </div>
    )
})
