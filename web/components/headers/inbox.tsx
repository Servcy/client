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
    <>
        <div className="relative z-[15] flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 mb-6 rounded-lg border-[0.5px] p-6">
            <div className="flex">
                <AiOutlineInbox className="my-auto mr-2" size="24" />
                <p className="text-xl text-custom-text-100">Inbox</p>
                <Input
                    className="ml-auto max-w-[200px]"
                    value={search}
                    placeholder="search by notification..."
                    onChange={(event) => setSearch(event.target.value || "")}
                />
                <Button
                    onClick={fetchInbox}
                    className="ml-2 h-full text-custom-text-100 border-none"
                    disabled={loading}
                >
                    <AiOutlineSync
                        className={cn("my-auto", {
                            "animate-spin": loading,
                        })}
                        size="24"
                    />
                </Button>
            </div>
        </div>
    </>
)
