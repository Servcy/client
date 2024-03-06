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
        color: "#4D7E3E",
    },
    started: {
        key: "started",
        label: "Started",
        color: "#f59e0b",
    },
    completed: {
        key: "completed",
        label: "Completed",
        color: "#16a34a",
    },
    cancelled: {
        key: "cancelled",
        label: "Canceled",
        color: "#dc2626",
    },
}
