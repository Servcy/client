import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"

import { GanttChartRoot, IBlockUpdateData, ModuleGanttSidebar } from "@components/gantt-chart"
import { ModuleGanttBlock } from "@components/modules"

// mobx store
import { useModule, useProject } from "@hooks/store"

import { IModule } from "@servcy/types"

export const ModulesListGanttChartView: React.FC = observer(() => {
    const { workspaceSlug }= useParams()
    // store
    const { currentProjectDetails } = useProject()
    const { projectModuleIds, moduleMap, updateModuleDetails } = useModule()

    const handleModuleUpdate = async (module: IModule, data: IBlockUpdateData) => {
        if (!workspaceSlug || !module) return

        const payload: any = { ...data }
        if (data.sort_order) payload.sort_order = data.sort_order.newSortOrder

        await updateModuleDetails(workspaceSlug.toString(), module.project_id, module.id, payload)
    }

    const blockFormat = (blocks: string[]) =>
        blocks?.map((blockId) => {
            const block = moduleMap[blockId]
            return {
                data: block,
                id: block?.id,
                sort_order: block?.sort_order,
                start_date: block?.start_date ? new Date(block?.start_date) : null,
                target_date: block?.target_date ? new Date(block?.target_date) : null,
            }
        })

    const isAllowed = currentProjectDetails?.member_role === 20 || currentProjectDetails?.member_role === 15

    return (
        <div className="h-full w-full overflow-y-auto">
            <GanttChartRoot
                title="Modules"
                loaderTitle="Modules"
                blocks={projectModuleIds ? blockFormat(projectModuleIds) : null}
                sidebarToRender={(props) => <ModuleGanttSidebar {...props} />}
                blockUpdateHandler={(block, payload) => handleModuleUpdate(block, payload)}
                blockToRender={(data: IModule) => <ModuleGanttBlock moduleId={data.id} />}
                enableBlockLeftResize={isAllowed}
                enableBlockRightResize={isAllowed}
                enableBlockMove={isAllowed}
                enableReorder={isAllowed}
                enableAddBlock={isAllowed}
                showAllBlocks
            />
        </div>
    )
})
