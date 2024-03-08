import Image from "next/image"

import React, { Dispatch, SetStateAction } from "react"

import { SyncOutlined } from "@ant-design/icons"
import { Avatar, Button, ConfigProvider, Spin, Table, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import cn from "classnames"
import toast from "react-hot-toast"
import { HiArchiveBoxArrowDown } from "react-icons/hi2"
import { MdOutlineBlock } from "react-icons/md"

import Cause from "@components/inbox/Cause"

import IntegrationService from "@services/integration.service"

import type { InboxItem, PaginationDetails } from "@servcy/types"

const integration_service = new IntegrationService()

const InboxItems = (
    {
        setPage,
        page,
        inboxItems,
        inboxPagination,
        archiveItems,
        setSelectedRowIndex,
        loading,
        deleteItems,
        setIsInboxItemModalVisible,
        setSelectedItemIds,
        readItem,
        activeTab,
    }: {
        setPage: Dispatch<SetStateAction<number>>
        page: number
        readItem: (id: string | undefined) => void
        inboxItems: InboxItem[]
        inboxPagination: PaginationDetails
        loading: boolean
        activeTab: string
        archiveItems: (_: React.Key[]) => void
        deleteItems: (_: number[]) => void
        setSelectedItemIds: Dispatch<SetStateAction<React.Key[]>>
        setSelectedRowIndex: Dispatch<SetStateAction<number>>
        setIsInboxItemModalVisible: Dispatch<SetStateAction<boolean>>
    }
) => {
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedItemIds(selectedRowKeys)
        },
        getCheckboxProps: (record: InboxItem) => ({
            name: record.id,
        }),
    }

    const disableNotificationTypeHandler = (event: string, user_integration_id: number) => {
        integration_service
            .disableNotificationType({ event, user_integration_id })
            .then(() => {
                toast.success("Notification type disabled successfully")
            })
            .catch(() => {
                toast.error("Error in disabling notification type")
            })
    }

    const columns: ColumnsType<InboxItem> = [
        {
            dataIndex: "title",
            title: "Title",
            render: (title, row, index) => (
                <button
                    className="cursor-pointer text-left"
                    onClick={() => {
                        setSelectedRowIndex(index)
                        setIsInboxItemModalVisible(true)
                        !row.is_read && readItem(row.id)
                    }}
                >
                    {title}
                </button>
            ),
        },
        {
            dataIndex: "account",
            width: 100,
            title: "Source",
            render: (account) => (
                <div className="flex min-h-[50px] max-w-[250px] items-center text-sm">
                    <Avatar className="mr-2 rounded-full" size="small">
                        {account.slice(0, 1).toUpperCase()}
                    </Avatar>
                    <div className="overflow-hidden truncate">{account}</div>
                </div>
            ),
        },
        {
            dataIndex: "cause",
            title: "From",
            width: 200,
            render: (cause, record) => <Cause cause={cause} source={record.source} />,
        },
        {
            dataIndex: "created_at",
            title: "Date",
            width: 200,
            render: (date) =>
                new Date(date).toLocaleDateString(navigator.language || "en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                }),
        },
        {
            dataIndex: "source",
            width: 100,
            title: "Source",
            render: (source, _, index) => (
                <Image
                    className="my-auto max-h-[30px] min-h-[30px] min-w-[30px] max-w-[30px] rounded-lg border border-servcy-gray bg-servcy-white p-1 last-of-type:mr-5"
                    src={`https://servcy-public.s3.amazonaws.com/${source.toLowerCase()}.svg`}
                    width={40}
                    key={`logo-${index}`}
                    height={40}
                    alt={source}
                />
            ),
        },
        {
            dataIndex: "id",
            title: "Actions",
            width: 100,
            render: (id, record) => (
                <div className="flex gap-1">
                    <Tooltip title={activeTab === "archived" ? "Delete" : "Archive"}>
                        <Button
                            type="primary"
                            className={cn("bg-servcy-cream text-servcy-black", {
                                "hover:!bg-servcy-wheat": activeTab !== "archived",
                                "hover:!bg-rose-600": activeTab === "archived",
                            })}
                            size="small"
                            onClick={() => {
                                if (activeTab !== "archived") archiveItems([parseInt(id)])
                                else deleteItems([parseInt(id)])
                            }}
                            icon={<HiArchiveBoxArrowDown className="mt-1" />}
                        />
                    </Tooltip>
                    {activeTab === "notification" && record.cause !== "None" && (
                        <Tooltip title="Disable these type of notifications">
                            <Button
                                type="primary"
                                className="bg-servcy-cream text-servcy-black hover:!bg-servcy-wheat"
                                size="small"
                                icon={<MdOutlineBlock className="mt-1" />}
                                onClick={() => {
                                    disableNotificationTypeHandler(record.body, record.user_integration_id)
                                }}
                            />
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ]

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        rowHoverBg: "#2B3232",
                        headerBg: "#F1F2EF",
                        rowSelectedBg: "#2B3232",
                        rowSelectedHoverBg: "#2B3232",
                    },
                },
            }}
        >
            <Table
                dataSource={inboxItems}
                columns={columns}
                rowKey={(record) => record.id}
                className="max-h-[600px] overflow-scroll"
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                loading={{
                    spinning: loading,
                    indicator: (
                        <Spin
                            className="m-auto"
                            size="large"
                            indicator={
                                <SyncOutlined
                                    spin
                                    style={{
                                        color: "#26542F",
                                    }}
                                />
                            }
                        />
                    ),
                }}
                rowClassName={(record) =>
                    cn("bg-servcy-black text-white rounded-tr", {
                        "opacity-80": !record.is_read,
                    })
                }
                showHeader={false}
                pagination={{
                    current: page,
                    pageSizeOptions: ["50"],
                    pageSize: 50,
                    total: inboxPagination.total_items,
                    onChange: (page) => {
                        setPage(page)
                    },
                }}
            />
        </ConfigProvider>
    )
}

export default InboxItems
