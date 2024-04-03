import Image from "next/image"

import React, { Dispatch, SetStateAction } from "react"

import { SyncOutlined } from "@ant-design/icons"
import { Avatar, Button, ConfigProvider, Spin, Table, theme, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import cn from "classnames"
import { useTheme } from "next-themes"
import toast from "react-hot-toast"
import { HiArchiveBoxArrowDown } from "react-icons/hi2"
import { MdAddTask, MdOutlineBlock } from "react-icons/md"

import Cause from "@components/inbox/Cause"
import ConvertToIssueModal from "@components/inbox/ConvertToIssueModal"

import IntegrationService from "@services/integration.service"

import type { InboxItem, PaginationDetails } from "@servcy/types"

const integrationService = new IntegrationService()

const InboxItems = ({
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
}) => {
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedItemIds(selectedRowKeys)
        },
        getCheckboxProps: (record: InboxItem) => ({
            name: record.id,
        }),
    }
    const [isConvertToIssueModalVisible, setIsConvertToIssueModalVisible] = React.useState(false)
    const { resolvedTheme } = useTheme()
    const { darkAlgorithm, defaultAlgorithm } = theme
    const disableNotificationTypeHandler = (event: string, user_integration_id: number) => {
        integrationService
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
            title: "Source",
            render: (account, record) => (
                <>
                    <div className="flex min-h-[50px] max-w-[250px] items-center text-ellipsis text-sm">
                        <Avatar className="mr-2 rounded-full" size="small">
                            {account.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <div className="overflow-hidden truncate mr-6">{account}</div>
                        <Cause cause={record.cause} source={record.source} />
                    </div>
                </>
            ),
        },
        {
            dataIndex: "created_at",
            title: "Date",
            width: 150,
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
            title: "Source",
            render: (source, _, index) => (
                <Image
                    className="my-auto max-h-[30px] min-h-[30px] min-w-[30px] max-w-[30px] rounded-lg border border-custom-servcy-gray bg-custom-servcy-white p-1 last-of-type:mr-5"
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
            render: (id, record) => (
                <div className="flex gap-1">
                    <Tooltip title={activeTab === "archived" ? "Delete" : "Archive"}>
                        <Button
                            type="primary"
                            className={cn("bg-custom-servcy-cream text-custom-servcy-black", {
                                "hover:!bg-custom-servcy-wheat": activeTab !== "archived",
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
                                className="bg-custom-servcy-cream text-custom-servcy-black hover:!bg-custom-servcy-wheat"
                                size="small"
                                icon={<MdOutlineBlock className="mt-1" />}
                                onClick={() => {
                                    disableNotificationTypeHandler(record.body, record.user_integration_id)
                                }}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Create a task from this inbox item">
                        <Button
                            type="primary"
                            className="bg-custom-servcy-cream text-custom-servcy-black hover:!bg-custom-servcy-wheat"
                            size="small"
                            icon={<MdAddTask className="mt-1" />}
                            onClick={() => setIsConvertToIssueModalVisible(true)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ]

    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            rowHoverBg: resolvedTheme === "dark" ? "#2B3232" : "#F1F2EF",
                            headerBg: "#F1F2EF",
                            rowSelectedBg: resolvedTheme === "dark" ? "#2B3232" : "#F1F2EF",
                            rowSelectedHoverBg: resolvedTheme === "dark" ? "#2B3232" : "#F1F2EF",
                        },
                    },
                    algorithm: resolvedTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
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
                        cn("text-custom-text-100 rounded-tr", {
                            "bg-custom-background-80": !record.is_read,
                            "bg-custom-background-100": record.is_read,
                        })
                    }
                    showHeader={false}
                    pagination={{
                        current: page,
                        pageSizeOptions: ["50"],
                        pageSize: 50,
                        total: inboxPagination.total_items,
                        hideOnSinglePage: true,
                        onChange: (page) => {
                            setPage(page)
                        },
                    }}
                />
            </ConfigProvider>
            <ConvertToIssueModal
                isOpen={isConvertToIssueModalVisible}
                onClose={() => {
                    setIsConvertToIssueModalVisible(false)
                }}
            />
        </>
    )
}

export default InboxItems
