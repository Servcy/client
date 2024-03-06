import { FC } from "react"
import { PagesListView } from "@components/pages/pages-list"
import { useProjectPages } from "@hooks/store/use-project-specific-pages"
import { observer } from "mobx-react-lite"
import { Loader } from "@servcy/ui"

export const SharedPagesList: FC = observer(() => {
    const projectPageStore = useProjectPages()
    const { publicProjectPageIds } = projectPageStore

    if (!publicProjectPageIds)
        return (
            <Loader className="space-y-4">
                <Loader.Item height="40px" />
                <Loader.Item height="40px" />
                <Loader.Item height="40px" />
            </Loader>
        )

    return <PagesListView pageIds={publicProjectPageIds} />
})
