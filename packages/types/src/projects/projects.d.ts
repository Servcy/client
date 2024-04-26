import { ERoles } from "@constants/iam"

import type { IEstimatePointLite, IIssueLabel, IUser, IUserLite, IWorkspace, IWorkspaceLite, TStateGroups } from ".."

export interface IProject {
    archive_in: number
    archived_at: string | null
    close_in: number
    created_at: Date
    archived_issues: number
    archived_sub_issues: number
    created_by: string
    cover_image: string | null
    cycle_view: boolean
    issue_views_view: boolean
    draft_issues: number
    draft_sub_issues: number
    module_view: boolean
    page_view: boolean
    default_assignee: IUser | string | null
    default_state: string | null
    description: string
    sub_issues: number
    budget?: {
        id?: string
        currency: string
        amount: string
    }
    total_issues: number
    emoji: string | null
    emoji_and_icon:
        | string
        | {
              name: string
              color: string
          }
        | null
    estimate: string | null
    icon_prop: {
        name: string
        color: string
    } | null
    id: string
    identifier: string
    is_deployed: boolean
    is_favorite: boolean
    is_member: boolean
    member_role: ERoles | null
    members: IProjectMemberLite[]
    name: string
    access: number
    lead: IUserLite | string | null
    sort_order: number | null
    total_cycles: number
    total_members: number
    total_modules: number
    updated_at: Date
    updated_by: string
    workspace: IWorkspace | string
    workspace_detail: IWorkspaceLite
}

export interface IProjectTemplate {
    workspace: IWorkspace | string
    estimates: {
        name: string
        description: string
        points: IEstimatePointLite[]
    }
    labels: Partial<IIssueLabel>[]
}

export interface IProjectLite {
    id: string
    name: string
    identifier: string
}

type ProjectPreferences = {
    pages: {
        block_display: boolean
    }
}

export interface IProjectMap {
    [id: string]: IProject
}

export interface IProjectMemberLite {
    id: string
    member__avatar: string
    member__display_name: string
    member_id: string
}

export interface IProjectMember {
    id: string
    member: IUserMemberLite
    project: IProjectLite
    workspace: IWorkspaceLite
    comment: string
    role: ERoles

    preferences: ProjectPreferences

    view_props: IProjectViewProps
    default_props: IProjectViewProps

    created_at: Date
    updated_at: Date
    created_by: string
    updated_by: string
}

export interface IProjectMemberRate {
    id?: string
    rate?: string
    currency?: string
    per_hour_or_per_project?: boolean
}

export interface IProjectMembership {
    id: string
    member: string
    role: ERoles
    rate?: IProjectMemberRate
}

export interface IProjectBulkAddFormData {
    members: { role: ERoles; member_id: string }[]
}

export interface IGithubRepository {
    id: string
    full_name: string
    html_url: string
    url: string
}

export type TProjectIssuesSearchParams = {
    search: string
    parent?: boolean
    issue_relation?: boolean
    cycle?: boolean
    module?: string
    sub_issue?: boolean
    issue_id?: string
    workspace_search: boolean
}

export interface ISearchIssueResponse {
    id: string
    name: string
    project_id: string
    project__identifier: string
    project__name: string
    sequence_id: number
    state__color: string
    state__group: TStateGroups
    state__name: string
    workspace__slug: string
}

export interface IProjectExpense {
    id: string
    project: string
    workspace: string
    recurring: "yearly" | "monthly" | "weekly" | "daily"
    amount: string
    currency: string
    description: string
    created_at: Date
    updated_at: Date
    created_by: string
    updated_by: string
}
