import CSVLogo from "public/services/csv.svg"
import ExcelLogo from "public/services/excel.svg"
import GithubLogo from "public/services/github.png"
import JiraLogo from "public/services/jira.svg"
import JSONLogo from "public/services/json.svg"

import { SettingIcon } from "@components/icons"
import { Props } from "@components/icons/types"

import { ERoles } from "@constants/iam"

import { TStaticViewTypes } from "@servcy/types"

export const IMPORTERS_LIST = [
    {
        provider: "github",
        type: "import",
        title: "GitHub",
        description: "Import issues from GitHub repositories and sync them.",
        logo: GithubLogo,
    },
    {
        provider: "jira",
        type: "import",
        title: "Jira",
        description: "Import issues and epics from Jira projects and epics.",
        logo: JiraLogo,
    },
]

export const EXPORTERS_LIST = [
    {
        provider: "csv",
        type: "export",
        title: "CSV",
        description: "Export issues to a CSV file.",
        logo: CSVLogo,
    },
    {
        provider: "xlsx",
        type: "export",
        title: "Excel",
        description: "Export issues to a Excel file.",
        logo: ExcelLogo,
    },
    {
        provider: "json",
        type: "export",
        title: "JSON",
        description: "Export issues to a JSON file.",
        logo: JSONLogo,
    },
]

export const DEFAULT_GLOBAL_VIEWS_LIST: {
    key: TStaticViewTypes
    label: string
}[] = [
    {
        key: "all-issues",
        label: "All issues",
    },
    {
        key: "assigned",
        label: "Assigned",
    },
    {
        key: "created",
        label: "Created",
    },
    {
        key: "subscribed",
        label: "Subscribed",
    },
]

export const RESTRICTED_URLS = ["404", "accounts", "api", "error", "invitations", "onboarding", "profile", "workspace"]

export const WORKSPACE_SETTINGS_LINKS: {
    key: string
    label: string
    href: string
    access: ERoles
    highlight: (pathname: string, baseUrl: string) => boolean
    Icon: React.FC<Props>
}[] = [
    {
        key: "general",
        label: "General",
        href: `/settings`,
        access: ERoles.MEMBER,
        highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/settings`,
        Icon: SettingIcon,
    },
    {
        key: "members",
        label: "Members",
        href: `/settings/members`,
        access: ERoles.MEMBER,
        highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/settings/members`,
        Icon: SettingIcon,
    },
    {
        key: "billing-and-plans",
        label: "Billing and plans",
        href: `/settings/billing`,
        access: ERoles.ADMIN,
        highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/settings/billing`,
        Icon: SettingIcon,
    },
    {
        key: "webhooks",
        label: "Webhooks",
        href: `/settings/webhooks`,
        access: ERoles.ADMIN,
        highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/settings/webhooks`,
        Icon: SettingIcon,
    },
    {
        key: "api-tokens",
        label: "API tokens",
        href: `/settings/api-tokens`,
        access: ERoles.ADMIN,
        highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}/settings/api-tokens`,
        Icon: SettingIcon,
    },
]
