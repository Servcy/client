import { Globe2, Lock, LucideIcon } from "lucide-react"

export enum ERoles {
    GUEST = 0,
    MEMBER = 1,
    ADMIN = 2,
    OWNER = 3,
}

export const ROLES = {
    0: "Guest",
    1: "Member",
    2: "Admin",
    3: "Owner",
}

export enum EAccess {
    PRIVATE = 1,
    PUBLIC = 0,
}

export const ACCESS_CHOICES: {
    key: 0 | 1
    label: string
    description: string
    icon: LucideIcon
}[] = [
    {
        key: 1,
        label: "Private",
        description: "Accessible only by invite",
        icon: Lock,
    },
    {
        key: 0,
        label: "Public",
        description: "Anyone in the workspace can join",
        icon: Globe2,
    },
]
