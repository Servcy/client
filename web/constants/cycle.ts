import { GanttChartSquare, LayoutGrid, List } from "lucide-react"

// types
import { TCycleLayoutOptions, TCycleTabOptions } from "@servcy/types"

export const CYCLE_TABS_LIST: {
    key: TCycleTabOptions
    name: string
}[] = [
    {
        key: "active",
        name: "Active",
    },
    {
        key: "all",
        name: "All",
    },
]

export const CYCLE_VIEW_LAYOUTS: {
    key: TCycleLayoutOptions
    icon: any
    title: string
}[] = [
    {
        key: "list",
        icon: List,
        title: "List layout",
    },
    {
        key: "board",
        icon: LayoutGrid,
        title: "Grid layout",
    },
    {
        key: "gantt",
        icon: GanttChartSquare,
        title: "Gantt layout",
    },
]

export const CYCLE_STATUS: {
    label: string
    value: "current" | "upcoming" | "completed" | "draft"
    title: string
    color: string
    textColor: string
    bgColor: string
}[] = [
    {
        label: "day left",
        value: "current",
        title: "Active",
        color: "#F59E0B",
        textColor: "text-amber-500",
        bgColor: "bg-amber-50",
    },
    {
        label: "Yet to start",
        value: "upcoming",
        title: "Yet to start",
        color: "#3F76FF",
        textColor: "text-blue-500",
        bgColor: "bg-indigo-50",
    },
    {
        label: "Completed",
        value: "completed",
        title: "Completed",
        color: "#16A34A",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        label: "Draft",
        value: "draft",
        title: "Draft",
        color: "#525252",
        textColor: "text-custom-text-300",
        bgColor: "bg-custom-background-90",
    },
]

export const CYCLE_STATE_GROUPS_DETAILS = [
    {
        key: "backlog_issues",
        title: "Backlog",
        color: "#F0F0F3",
    },
    {
        key: "unstarted_issues",
        title: "Unstarted",
        color: "#FB923C",
    },
    {
        key: "started_issues",
        title: "Started",
        color: "#FFC53D",
    },
    {
        key: "completed_issues",
        title: "Completed",
        color: "#d687ff",
    },
    {
        key: "cancelled_issues",
        title: "Cancelled",
        color: "#ef4444",
    },
]
