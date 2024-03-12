"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { observer } from "mobx-react-lite"

import { PageHead } from "@components/core"
import { CreateWorkspaceForm } from "@components/workspace"

import { useUser } from "@hooks/store"

import DefaultWrapper from "@wrappers/DefaultWrapper"

import type { IWorkspace } from "@servcy/types"

const CreateWorkspacePage = observer(() => {
    const router = useRouter()
    // store hooks
    const { updateCurrentUser } = useUser()
    // states
    const [defaultValues, setDefaultValues] = useState({
        name: "",
        slug: "",
    })

    const onSubmit = async (workspace: IWorkspace) => {
        await updateCurrentUser({ last_workspace_id: workspace.id }).then(() => router.push(`/${workspace.slug}`))
    }

    return (
        <DefaultWrapper>
            <PageHead title="Create Workspace" />
            <div className="flex h-full flex-col gap-y-2 overflow-hidden sm:flex-row sm:gap-y-0">
                <div className="relative flex h-full justify-center px-12 pb-8 sm:items-center sm:justify-start sm:p-0 sm:pr-[8.33%] w-full">
                    <div className="w-full">
                        <h4 className="text-2xl font-semibold">Create your workspace</h4>
                        <div className="sm:w-3/4 md:w-2/5">
                            <CreateWorkspaceForm
                                onSubmit={onSubmit}
                                defaultValues={defaultValues}
                                setDefaultValues={setDefaultValues}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    )
})

export default CreateWorkspacePage
