"use client"

import { useParams } from "next/navigation"

import { useState } from "react"

import { observer } from "mobx-react"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { WorkspaceSettingHeader } from "@components/headers"
import { ProjectTemplateLabelList } from "@components/labels"

import { WORKSPACE_PROJECT_TEMPLATE } from "@constants/fetch-keys"

import { ProjectTemplateService } from "@services/project"

import { AppWrapper } from "@wrappers/app"
import { WorkspaceSettingWrapper } from "@wrappers/settings"

import { IProjectTemplate } from "@servcy/types"

const projectTemplateService = new ProjectTemplateService()

const LabelsTemplatePage = observer(() => {
    const { workspaceSlug } = useParams()
    const [workspaceProjectTemplate, setWorkspaceProjectTemplate] = useState<IProjectTemplate>({} as IProjectTemplate)
    useSWR(
        WORKSPACE_PROJECT_TEMPLATE,
        async () => {
            await projectTemplateService.getTemplate(workspaceSlug.toString()).then((response) => {
                setWorkspaceProjectTemplate(response)
            })
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    )
    return (
        <AppWrapper header={<WorkspaceSettingHeader title="Workspace Label Template" />}>
            <WorkspaceSettingWrapper>
                <PageHead title="Label Template" />
                <section className="w-full overflow-y-auto py-8 pr-9">
                    <div>
                        <div className="flex  items-center border-b border-custom-border-100 py-3.5">
                            <h3 className="text-xl font-medium">Label Template</h3>
                        </div>
                    </div>
                    <ProjectTemplateLabelList {...workspaceProjectTemplate} />
                </section>
            </WorkspaceSettingWrapper>
        </AppWrapper>
    )
})

export default LabelsTemplatePage
