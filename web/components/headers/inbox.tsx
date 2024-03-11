import { Button, Input } from "antd"
import cn from "classnames"
import { AiOutlineInbox, AiOutlineSync } from "react-icons/ai"

export const InboxHeader = (
    {
        loading,
        fetchInbox,
        setSearch,
        search,
    }: {
        loading: boolean
        fetchInbox: () => void
        setSearch: (search: string) => void
        search: string
    }
) => (
    <div className="mb-6 h-[80px] rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200 hover:shadow-custom-shadow-4xl p-6">
        <div className="flex flex-row items-center">
            <AiOutlineInbox size="24" />
            <p className="truncate px-2 text-xl max-md:text-lg">Inbox</p>
            <Input
                className="ml-auto max-w-[200px]"
                value={search}
                placeholder="search by notification..."
                onChange={(event) => setSearch(event.target.value || "")}
            />
            <Button onClick={fetchInbox} className="ml-2 h-full text-custom-text-100 border-none" disabled={loading}>
                <AiOutlineSync
                    className={cn("my-auto", {
                        "animate-spin": loading,
                    })}
                    size="24"
                />
            </Button>
        </div>
    </div>
)
