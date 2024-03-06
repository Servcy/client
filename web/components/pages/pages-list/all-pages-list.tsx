import { FC } from "react"
import { PagesListView } from "@components/pages/pages-list"
import { useProjectPages } from "@hooks/store/use-project-specific-pages"
import { observer } from "mobx-react-lite"
import { Loader } from "@servcy/ui"

export const AllPagesList: FC = observer(() => {
    const pageStores = useProjectPages()
    // subscribing to the projectPageStore
    const { projectPageIds } = pageStores

    if (!projectPageIds) {
        return (
            <Loader className="space-y-4">
                <Loader.Item height="40px" />
                <Loader.Item height="40px" />
                <Loader.Item height="40px" />
            </Loader>
        )
    }
    return <PagesListView pageIds={projectPageIds} />
})
