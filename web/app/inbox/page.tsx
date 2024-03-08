"use client"

import { useEffect, useState } from "react"

import { Button, ConfigProvider, Input, Select, Tabs, theme } from "antd"
import cn from "classnames"
import debounce from "lodash/debounce"
import {
    AiOutlineComment,
    AiOutlineInbox,
    AiOutlineMessage,
    AiOutlineNotification,
    AiOutlineRead,
    AiOutlineSync,
} from "react-icons/ai"
import { GoMention } from "react-icons/go"
import { HiArchiveBoxArrowDown } from "react-icons/hi2"

import { PageHead } from "@components/core"
import InboxItemModal from "@components/inbox/InboxItemModal"
import InboxItems from "@components/inbox/InboxItems"

import { useUser } from "@hooks/store"

import { integrationInboxCategories } from "@constants/integration"

import InboxService from "@services/inbox.service"

import DefaultWrapper from "@wrappers/DefaultWrapper"
import UserAuthWrapper from "@wrappers/UserAuthWrapper"

import type { InboxItem, PaginationDetails } from "@servcy/types"
import { Button as ServcyButton, Spinner } from "@servcy/ui"

const inbox_service = new InboxService()

const tabItems = [
    {
        key: "message",
        label: "Messages",
        Icon: AiOutlineMessage,
    },
    {
        key: "comment",
        label: "Comments",
        Icon: AiOutlineComment,
    },
    {
        key: "notification",
        label: "Notifications",
        Icon: AiOutlineNotification,
    },
    {
        key: "archived",
        label: "Archived",
        Icon: AiOutlineRead,
    },
]

export default function Gmail(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")
    const [selectedItemIds, setSelectedItemIds] = useState<React.Key[]>([])
    const [inboxItems, setInboxItems] = useState<InboxItem[]>([] as InboxItem[])
    const [inboxPagination, setInboxPagination] = useState<PaginationDetails>({} as PaginationDetails)
    const [activeTab, setActiveTab] = useState<string>("message")
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<Record<string, string | boolean>>({
        category: "message",
    })
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1)
    const [isInboxItemModalVisible, setIsInboxItemModalVisible] = useState<boolean>(false)
    const [filterByIAmMentionedButtonText, setFilterByIAmMentionedButtonText] = useState<string>("For Me")
    const { currentUserLoader } = useUser()
    const { darkAlgorithm } = theme

    const refetchInboxItems = async () => {
        try {
            setLoading(true)
            const response = await inbox_service.fetchInbox({
                filters,
                search,
                page,
                pagination: { page },
            })
            setInboxItems(JSON.parse(response.results).items)
            setInboxPagination(JSON.parse(response.results).details)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const archiveItems = async (itemIds: React.Key[]) => {
        try {
            await inbox_service.archiveItems({
                item_ids: itemIds,
            })
            if (itemIds.length === inboxItems.length) {
                setInboxItems([])
                refetchInboxItems()
            } else setInboxItems((prevState) => prevState.filter((item) => !itemIds.includes(parseInt(item.id))))
        } catch (err) {
            console.error(err)
        }
    }

    const readItem = async (itemId: string | undefined) => {
        try {
            if (!itemId) return
            inbox_service.readItem({
                item_id: Number.parseInt(itemId),
            })
            setInboxItems((prevState) =>
                prevState.map((item) => {
                    if (item.id === itemId.toString()) {
                        return { ...item, is_read: true }
                    }
                    return item
                })
            )
        } catch (err) {
            console.error(err)
        }
    }

    const deleteItems = async (itemIds: number[]) => {
        try {
            inbox_service.deleteItems({
                item_ids: itemIds,
            })
            if (itemIds.length === inboxItems.length) {
                setInboxItems([])
                refetchInboxItems()
            } else setInboxItems((prevState) => prevState.filter((item) => !itemIds.includes(parseInt(item.id))))
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const debouncedFetchInbox = debounce(async () => {
            try {
                const response = await inbox_service.fetchInbox({
                    filters,
                    search,
                    page,
                    pagination: { page },
                })
                setInboxItems(JSON.parse(response.results).items)
                setInboxPagination(JSON.parse(response.results).details)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }, 500)
        debouncedFetchInbox()
        return () => {
            debouncedFetchInbox.cancel()
        }
    }, [page, filters, search, activeTab])

    return (
        <UserAuthWrapper>
            <DefaultWrapper>
                <PageHead title="Integrations" />
                {currentUserLoader ? (
                    <div className="grid h-screen w-full place-items-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="p-6">
                        <header className="mb-6 h-[80px] rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200 p-6">
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
                                    onClick={refetchInboxItems}
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
                        </header>
                        <div className="mb-6 max-h-[80vh] rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200 overflow-y-scroll p-6 text-lg">
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Tabs: {
                                            inkBarColor: "rgb(67, 72, 79)",
                                        },
                                    },
                                    algorithm: darkAlgorithm,
                                }}
                            >
                                <Tabs
                                    defaultActiveKey="message"
                                    onChange={(key) => {
                                        setFilters((prevState) => ({ ...prevState, category: key }))
                                        setActiveTab(key)
                                        if (key === "comment") {
                                            setFilterByIAmMentionedButtonText("Mentions Me")
                                        } else {
                                            setFilterByIAmMentionedButtonText("For Me")
                                        }
                                    }}
                                    tabBarExtraContent={
                                        <div className="flex">
                                            <ServcyButton
                                                className="mr-2"
                                                onClick={() => {
                                                    setFilters((prevState) => ({
                                                        ...prevState,
                                                        i_am_mentioned: !prevState["i_am_mentioned"],
                                                    }))
                                                }}
                                                variant={filters["i_am_mentioned"] ? "primary" : "outline-primary"}
                                            >
                                                <GoMention className="mr-2" />
                                                <span>{filterByIAmMentionedButtonText}</span>
                                            </ServcyButton>
                                            <ServcyButton
                                                className="mr-2"
                                                disabled={inboxItems.length === 0}
                                                onClick={() => {
                                                    if (activeTab !== "archived")
                                                        archiveItems(inboxItems.map((item) => parseInt(item.id)))
                                                    else deleteItems(inboxItems.map((item) => parseInt(item.id)))
                                                }}
                                                variant="outline-danger"
                                            >
                                                <HiArchiveBoxArrowDown className="mr-2" />
                                                <span>
                                                    {activeTab === "archived" ? "Delete" : "Archive"} All (
                                                    {inboxItems.length})
                                                </span>
                                            </ServcyButton>
                                            <ServcyButton
                                                className="mr-2"
                                                disabled={selectedItemIds.length === 0}
                                                onClick={() => {
                                                    if (activeTab !== "archived")
                                                        archiveItems(
                                                            selectedItemIds.map((item_id) =>
                                                                parseInt(item_id.toString())
                                                            )
                                                        )
                                                    else
                                                        deleteItems(
                                                            selectedItemIds.map((item_id) =>
                                                                parseInt(item_id.toString())
                                                            )
                                                        )
                                                }}
                                                variant="tertiary-danger"
                                            >
                                                <HiArchiveBoxArrowDown className="mr-2" />
                                                <span>{activeTab === "archived" ? "Delete" : "Archive"} Selected</span>
                                            </ServcyButton>
                                            <Select
                                                placeholder="Filter By Source"
                                                allowClear
                                                onClear={() => {
                                                    setFilters((prevState) => ({ ...prevState, source: "" }))
                                                }}
                                                value={filters["source"]}
                                                onChange={(value) => {
                                                    setFilters((prevState) => ({ ...prevState, source: value }))
                                                }}
                                                options={Object.entries(integrationInboxCategories)
                                                    .filter(([_, value]) => value.includes(activeTab))
                                                    .map(([key, _]) => ({ label: key, value: key }))}
                                            />
                                        </div>
                                    }
                                    items={tabItems.map((item) => ({
                                        label: (
                                            <div
                                                className={cn(
                                                    "flex justify-center text-custom-text-200 align-middle hover:!text-custom-servcy-wheat",
                                                    {
                                                        "text-custom-text-100 font-semibold": activeTab === item.key,
                                                    }
                                                )}
                                            >
                                                <item.Icon className="my-auto mr-2" />
                                                {item.label}{" "}
                                                {activeTab === item.key
                                                    ? `(${inboxPagination.total_items || "-"})`
                                                    : ""}
                                            </div>
                                        ),
                                        key: item.key,
                                        children: (
                                            <InboxItems
                                                setPage={setPage}
                                                page={page}
                                                inboxPagination={inboxPagination}
                                                setSelectedRowIndex={setSelectedRowIndex}
                                                setIsInboxItemModalVisible={setIsInboxItemModalVisible}
                                                archiveItems={archiveItems}
                                                inboxItems={inboxItems}
                                                readItem={readItem}
                                                activeTab={activeTab}
                                                loading={loading}
                                                deleteItems={deleteItems}
                                                setSelectedItemIds={setSelectedItemIds}
                                            />
                                        ),
                                    }))}
                                />
                            </ConfigProvider>
                        </div>
                        {isInboxItemModalVisible && (
                            <InboxItemModal
                                selectedRow={inboxItems[selectedRowIndex] ?? ({} as InboxItem)}
                                setIsInboxItemModalVisible={setIsInboxItemModalVisible}
                                selectedRowIndex={selectedRowIndex}
                                readItem={readItem}
                                setSelectedRowIndex={setSelectedRowIndex}
                                totalInboxItems={inboxItems.length}
                            />
                        )}
                    </div>
                )}
            </DefaultWrapper>
        </UserAuthWrapper>
    )
}
