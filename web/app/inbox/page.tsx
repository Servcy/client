"use client"

import { useEffect, useState } from "react"

import { Button, ConfigProvider, Select, Tabs, theme } from "antd"
import cn from "classnames"
import debounce from "lodash/debounce"
import { observer } from "mobx-react"
import { useTheme } from "next-themes"
import { AiOutlineComment, AiOutlineMessage, AiOutlineNotification, AiOutlineRead } from "react-icons/ai"
import { GoMention } from "react-icons/go"
import { HiArchiveBoxArrowDown } from "react-icons/hi2"

import { PageHead } from "@components/core"
import { InboxHeader } from "@components/headers/inbox"
import InboxItemModal from "@components/inbox/InboxItemModal"
import InboxItems from "@components/inbox/InboxItems"

import useUserInbox from "@hooks/use-user-inbox"

import { integrationInboxCategories } from "@constants/integration"

import InboxService from "@services/inbox.service"

import DefaultWrapper from "@wrappers/DefaultWrapper"

import { getNumberCount } from "@helpers/string.helper"

import type { InboxItem, PaginationDetails } from "@servcy/types"
import { Button as ServcyButton } from "@servcy/ui"

const inboxService = new InboxService()

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

const Inbox = observer(() => {
    const [loading, setLoading] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")
    const [selectedItemIds, setSelectedItemIds] = useState<React.Key[]>([])
    const [inboxItems, setInboxItems] = useState<InboxItem[]>([] as InboxItem[])
    const [inboxPagination, setInboxPagination] = useState<PaginationDetails>({} as PaginationDetails)
    const [activeTab, setActiveTab] = useState<string>("message")
    const [page, setPage] = useState<number>(1)
    const { unreadCount, mutateUnreadCount } = useUserInbox()
    const [filters, setFilters] = useState<Record<string, string | boolean>>({
        category: "message",
    })
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1)
    const [isInboxItemModalVisible, setIsInboxItemModalVisible] = useState<boolean>(false)
    const [filterByIAmMentionedButtonText, setFilterByIAmMentionedButtonText] = useState<string>("For Me")
    const { darkAlgorithm, defaultAlgorithm } = theme
    const { resolvedTheme } = useTheme()

    const refetchInboxItems = async () => {
        try {
            setLoading(true)
            const response = await inboxService.fetchInbox({
                filters,
                search,
                page,
                pagination: { page },
            })
            setInboxItems(response.results.items)
            setInboxPagination(response.results.details)
        } finally {
            setLoading(false)
        }
    }

    const archiveItems = async (itemIds: React.Key[]) => {
        try {
            await inboxService.archiveItems({
                item_ids: itemIds,
            })
            if (itemIds.length === inboxItems.length) {
                setInboxItems([])
                refetchInboxItems()
            } else setInboxItems((prevState) => prevState.filter((item) => !itemIds.includes(parseInt(item.id))))
            mutateUnreadCount()
        } catch {}
    }

    const readItem = async (itemId: string | undefined) => {
        try {
            if (!itemId) return
            inboxService.readItem({
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
            mutateUnreadCount()
        } catch {}
    }

    const deleteItems = async (itemIds: number[]) => {
        try {
            inboxService.deleteItems({
                item_ids: itemIds,
            })
            if (itemIds.length === inboxItems.length) {
                setInboxItems([])
                refetchInboxItems()
            } else setInboxItems((prevState) => prevState.filter((item) => !itemIds.includes(parseInt(item.id))))
            mutateUnreadCount()
        } catch {}
    }

    useEffect(() => {
        const debouncedFetchInbox = debounce(async () => {
            try {
                setLoading(true)
                const response = await inboxService.fetchInbox({
                    filters,
                    search,
                    page,
                    pagination: { page },
                })
                setInboxItems(response.results.items)
                setInboxPagination(response.results.details)
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
        <DefaultWrapper
            header={
                <InboxHeader loading={loading} search={search} setSearch={setSearch} fetchInbox={refetchInboxItems} />
            }
        >
            <PageHead title="Inbox" />
            <div className="p-6">
                <div className="mb-6 max-h-[80vh] rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200 overflow-y-scroll p-6 text-lg">
                    <ConfigProvider
                        theme={{
                            components: {
                                Tabs: {
                                    inkBarColor: resolvedTheme !== "dark" ? "rgb(67, 72, 79)" : "rgb(255, 255, 255)",
                                },
                            },
                            algorithm: resolvedTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
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
                                    <Button
                                        className="mr-2 text-sm hover:!border-red-400 max-md:hidden hover:!text-red-400"
                                        disabled={inboxItems.length === 0}
                                        onClick={() => {
                                            if (activeTab !== "archived")
                                                archiveItems(inboxItems.map((item) => parseInt(item.id)))
                                            else deleteItems(inboxItems.map((item) => parseInt(item.id)))
                                        }}
                                        icon={<HiArchiveBoxArrowDown />}
                                    >
                                        <span>
                                            {activeTab === "archived" ? "Delete" : "Archive"} All ({inboxItems.length})
                                        </span>
                                    </Button>
                                    <Button
                                        className="mr-2 text-sm hover:!border-red-400 hover:!text-red-400 max-md:hidden"
                                        disabled={selectedItemIds.length === 0}
                                        onClick={() => {
                                            if (activeTab !== "archived")
                                                archiveItems(
                                                    selectedItemIds.map((item_id) => parseInt(item_id.toString()))
                                                )
                                            else
                                                deleteItems(
                                                    selectedItemIds.map((item_id) => parseInt(item_id.toString()))
                                                )
                                        }}
                                        icon={<HiArchiveBoxArrowDown />}
                                    >
                                        <span>{activeTab === "archived" ? "Delete" : "Archive"} Selected</span>
                                    </Button>
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
                                        {unreadCount && unreadCount[item.key]
                                            ? `(${getNumberCount(unreadCount[item.key]) || "-"})`
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
        </DefaultWrapper>
    )
})

export default Inbox
