import { TStateGroups } from "@servcy/types"

export const STATE_GROUPS: {
    [key in TStateGroups]: {
        key: TStateGroups
        label: string
        color: string
    }
} = {
    backlog: {
        key: "backlog",
        label: "Backlog",
        color: "#d9d9d9",
    },
    unstarted: {
        key: "unstarted",
        label: "Unstarted",
        color: "#3F76FF",
    },
    started: {
        key: "started",
        label: "Started",
        color: "#f59e0b",
    },
    completed: {
        key: "completed",
        label: "Completed",
        color: "#4d7e3e",
    },
    cancelled: {
        key: "cancelled",
        label: "Canceled",
        color: "#dc2626",
    },
}
