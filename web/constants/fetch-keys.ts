import { objToQueryParams } from "@helpers/string.helper"

import { IAnalyticsParams, INotificationParams } from "@servcy/types"

const paramsToKey = (params: any) => {
    const {
        state,
        state_group,
        priority,
        mentions,
        assignees,
        created_by,
        labels,
        start_date,
        target_date,
        sub_issue,
        project,
        layout,
        subscriber,
    } = params

    let projectKey = project ? project.split(",") : []
    let stateKey = state ? state.split(",") : []
    let stateGroupKey = state_group ? state_group.split(",") : []
    let priorityKey = priority ? priority.split(",") : []
    let mentionsKey = mentions ? mentions.split(",") : []
    let assigneesKey = assignees ? assignees.split(",") : []
    let createdByKey = created_by ? created_by.split(",") : []
    let labelsKey = labels ? labels.split(",") : []
    let subscriberKey = subscriber ? subscriber.split(",") : []
    const startDateKey = start_date ?? ""
    const targetDateKey = target_date ?? ""
    const type = params.type ? params.type.toUpperCase() : "NULL"
    const groupBy = params.group_by ? params.group_by.toUpperCase() : "NULL"
    const orderBy = params.order_by ? params.order_by.toUpperCase() : "NULL"
    const layoutKey = layout ? layout.toUpperCase() : ""

    // sorting each keys in ascending order
    projectKey = projectKey.sort().join("_")
    stateKey = stateKey.sort().join("_")
    stateGroupKey = stateGroupKey.sort().join("_")
    priorityKey = priorityKey.sort().join("_")
    assigneesKey = assigneesKey.sort().join("_")
    mentionsKey = mentionsKey.sort().join("_")
    createdByKey = createdByKey.sort().join("_")
    labelsKey = labelsKey.sort().join("_")
    subscriberKey = subscriberKey.sort().join("_")

    return `${layoutKey}_${projectKey}_${stateGroupKey}_${stateKey}_${priorityKey}_${assigneesKey}_${mentionsKey}_${createdByKey}_${type}_${groupBy}_${orderBy}_${labelsKey}_${startDateKey}_${targetDateKey}_${sub_issue}_${subscriberKey}`
}

const myIssuesParamsToKey = (params: any) => {
    const { assignees, created_by, labels, priority, state_group, subscriber, start_date, target_date } = params

    let assigneesKey = assignees ? assignees.split(",") : []
    let createdByKey = created_by ? created_by.split(",") : []
    let stateGroupKey = state_group ? state_group.split(",") : []
    let subscriberKey = subscriber ? subscriber.split(",") : []
    let priorityKey = priority ? priority.split(",") : []
    let labelsKey = labels ? labels.split(",") : []
    const startDateKey = start_date ?? ""
    const targetDateKey = target_date ?? ""
    const type = params.type ? params.type.toUpperCase() : "NULL"
    const groupBy = params.group_by ? params.group_by.toUpperCase() : "NULL"
    const orderBy = params.order_by ? params.order_by.toUpperCase() : "NULL"

    // sorting each keys in ascending order
    assigneesKey = assigneesKey.sort().join("_")
    createdByKey = createdByKey.sort().join("_")
    stateGroupKey = stateGroupKey.sort().join("_")
    subscriberKey = subscriberKey.sort().join("_")
    priorityKey = priorityKey.sort().join("_")
    labelsKey = labelsKey.sort().join("_")

    return `${assigneesKey}_${createdByKey}_${stateGroupKey}_${subscriberKey}_${priorityKey}_${type}_${groupBy}_${orderBy}_${labelsKey}_${startDateKey}_${targetDateKey}`
}

export const CURRENT_USER = "CURRENT_USER"
export const USER_WORKSPACE_INVITATIONS = "USER_WORKSPACE_INVITATIONS"
export const USER_WORKSPACES = "USER_WORKSPACES"

export const WORKSPACE_DETAILS = (workspaceSlug: string) => `WORKSPACE_DETAILS_${workspaceSlug.toUpperCase()}`

export const WORKSPACE_MEMBERS = (workspaceSlug: string) => `WORKSPACE_MEMBERS_${workspaceSlug.toUpperCase()}`
export const WORKSPACE_MEMBERS_ME = (workspaceSlug: string) => `WORKSPACE_MEMBERS_ME${workspaceSlug.toUpperCase()}`
export const WORKSPACE_INVITATIONS = (workspaceSlug: string) => `WORKSPACE_INVITATIONS_${workspaceSlug.toString()}`
export const WORKSPACE_INVITATION = (invitationId: string) => `WORKSPACE_INVITATION_${invitationId}`
export const LAST_ACTIVE_WORKSPACE_AND_PROJECTS = "LAST_ACTIVE_WORKSPACE_AND_PROJECTS"

export const PROJECTS_LIST = (
    workspaceSlug: string,
    params: {
        is_favorite: "all" | boolean
    }
) => {
    if (!params) return `PROJECTS_LIST_${workspaceSlug.toUpperCase()}`

    return `PROJECTS_LIST_${workspaceSlug.toUpperCase()}_${params.is_favorite.toString().toUpperCase()}`
}
export const PROJECT_DETAILS = (projectId: string) => `PROJECT_DETAILS_${projectId}`

export const PROJECT_MEMBERS = (projectId: string) => `PROJECT_MEMBERS_${projectId}`
export const PROJECT_INVITATIONS = (projectId: string) => `PROJECT_INVITATIONS_${projectId.toString()}`

export const PROJECT_ISSUES_LIST = (workspaceSlug: string, projectId: string) =>
    `PROJECT_ISSUES_LIST_${workspaceSlug.toUpperCase()}_${projectId}`
export const PROJECT_ISSUES_LIST_WITH_PARAMS = (projectId: string, params?: any) => {
    if (!params) return `PROJECT_ISSUES_LIST_WITH_PARAMS_${projectId}`

    const paramsKey = paramsToKey(params)

    return `PROJECT_ISSUES_LIST_WITH_PARAMS_${projectId}_${paramsKey}`
}
export const PROJECT_ARCHIVED_ISSUES_LIST_WITH_PARAMS = (projectId: string, params?: any) => {
    if (!params) return `PROJECT_ARCHIVED_ISSUES_LIST_WITH_PARAMS_${projectId}`

    const paramsKey = paramsToKey(params)

    return `PROJECT_ARCHIVED_ISSUES_LIST_WITH_PARAMS_${projectId}_${paramsKey}`
}

export const PROJECT_DRAFT_ISSUES_LIST_WITH_PARAMS = (projectId: string, params?: any) => {
    if (!params) return `PROJECT_DRAFT_ISSUES_LIST_WITH_PARAMS${projectId}`

    const paramsKey = paramsToKey(params)

    return `PROJECT_DRAFT_ISSUES_LIST_WITH_PARAMS${projectId}_${paramsKey}`
}

export const GLOBAL_VIEWS_LIST = (workspaceSlug: string) => `GLOBAL_VIEWS_LIST_${workspaceSlug.toUpperCase()}`
export const GLOBAL_VIEW_DETAILS = (globalViewId: string) => `GLOBAL_VIEW_DETAILS_${globalViewId}`
export const GLOBAL_VIEW_ISSUES = (globalViewId: string) => `GLOBAL_VIEW_ISSUES_${globalViewId}`

export const PROJECT_ISSUES_DETAILS = (issueId: string) => `PROJECT_ISSUES_DETAILS_${issueId}`
export const PROJECT_ISSUES_PROPERTIES = (projectId: string) => `PROJECT_ISSUES_PROPERTIES_${projectId}`
export const PROJECT_ISSUES_COMMENTS = (issueId: string) => `PROJECT_ISSUES_COMMENTS_${issueId}`
export const PROJECT_ISSUES_ACTIVITY = (issueId: string) => `PROJECT_ISSUES_ACTIVITY_${issueId}`
export const PROJECT_ISSUE_BY_STATE = (projectId: string) => `PROJECT_ISSUE_BY_STATE_${projectId}`
export const PROJECT_ISSUE_LABELS = (projectId: string) => `PROJECT_ISSUE_LABELS_${projectId}`
export const WORKSPACE_LABELS = (workspaceSlug: string) => `WORKSPACE_LABELS_${workspaceSlug.toUpperCase()}`
export const PROJECT_GITHUB_REPOSITORY = (projectId: string) => `PROJECT_GITHUB_REPOSITORY_${projectId}`

// cycles
export const CYCLES_LIST = (projectId: string) => `CYCLE_LIST_${projectId}`
export const INCOMPLETE_CYCLES_LIST = (projectId: string) => `INCOMPLETE_CYCLES_LIST_${projectId}`
export const CURRENT_CYCLE_LIST = (projectId: string) => `CURRENT_CYCLE_LIST_${projectId}`
export const UPCOMING_CYCLES_LIST = (projectId: string) => `UPCOMING_CYCLES_LIST_${projectId}`
export const DRAFT_CYCLES_LIST = (projectId: string) => `DRAFT_CYCLES_LIST_${projectId}`
export const COMPLETED_CYCLES_LIST = (projectId: string) => `COMPLETED_CYCLES_LIST_${projectId}`
export const CYCLE_ISSUES = (cycleId: string) => `CYCLE_ISSUES_${cycleId}`
export const CYCLE_ISSUES_WITH_PARAMS = (cycleId: string, params?: any) => {
    if (!params) return `CYCLE_ISSUES_WITH_PARAMS_${cycleId}`

    const paramsKey = paramsToKey(params)

    return `CYCLE_ISSUES_WITH_PARAMS_${cycleId}_${paramsKey.toUpperCase()}`
}
export const CYCLE_DETAILS = (cycleId: string) => `CYCLE_DETAILS_${cycleId}`

export const STATES_LIST = (projectId: string) => `STATES_LIST_${projectId}`

export const USER_ISSUE = (workspaceSlug: string) => `USER_ISSUE_${workspaceSlug.toUpperCase()}`
export const USER_ISSUES = (workspaceSlug: string, params: any) => {
    const paramsKey = myIssuesParamsToKey(params)

    return `USER_ISSUES_${workspaceSlug.toUpperCase()}_${paramsKey}`
}
export const USER_ACTIVITY = "USER_ACTIVITY"
export const USER_WORKSPACE_DASHBOARD = (workspaceSlug: string) =>
    `USER_WORKSPACE_DASHBOARD_${workspaceSlug.toUpperCase()}`
export const USER_PROJECT_VIEW = (projectId: string) => `USER_PROJECT_VIEW_${projectId}`

export const MODULE_LIST = (projectId: string) => `MODULE_LIST_${projectId}`
export const MODULE_ISSUES = (moduleId: string) => `MODULE_ISSUES_${moduleId}`
export const MODULE_ISSUES_WITH_PARAMS = (moduleId: string, params?: any) => {
    if (!params) return `MODULE_ISSUES_WITH_PARAMS_${moduleId}`

    const paramsKey = paramsToKey(params)

    return `MODULE_ISSUES_WITH_PARAMS_${moduleId}_${paramsKey.toUpperCase()}`
}
export const MODULE_DETAILS = (moduleId: string) => `MODULE_DETAILS_${moduleId}`

export const VIEWS_LIST = (projectId: string) => `VIEWS_LIST_${projectId}`
export const VIEW_DETAILS = (viewId: string) => `VIEW_DETAILS_${viewId}`
export const VIEW_ISSUES = (viewId: string, params: any) => {
    if (!params) return `VIEW_ISSUES_${viewId}`

    const paramsKey = paramsToKey(params)

    return `VIEW_ISSUES_${viewId}_${paramsKey.toUpperCase()}`
}

// Issues
export const ISSUE_DETAILS = (issueId: string) => `ISSUE_DETAILS_${issueId}`
export const SUB_ISSUES = (issueId: string) => `SUB_ISSUES_${issueId}`
export const ISSUE_ATTACHMENTS = (issueId: string) => `ISSUE_ATTACHMENTS_${issueId}`
export const ARCHIVED_ISSUE_DETAILS = (issueId: string) => `ARCHIVED_ISSUE_DETAILS_${issueId}`

// Pages
export const RECENT_PAGES_LIST = (projectId: string) => `RECENT_PAGES_LIST_${projectId}`
export const ALL_PAGES_LIST = (projectId: string) => `ALL_PAGES_LIST_${projectId}`
export const ARCHIVED_PAGES_LIST = (projectId: string) => `ARCHIVED_PAGES_LIST_${projectId}`
export const FAVORITE_PAGES_LIST = (projectId: string) => `FAVORITE_PAGES_LIST_${projectId}`
export const PRIVATE_PAGES_LIST = (projectId: string) => `PRIVATE_PAGES_LIST_${projectId}`
export const SHARED_PAGES_LIST = (projectId: string) => `SHARED_PAGES_LIST_${projectId}`
export const PAGE_DETAILS = (pageId: string) => `PAGE_DETAILS_${pageId}`
export const PAGE_BLOCKS_LIST = (pageId: string) => `PAGE_BLOCK_LIST_${pageId}`
export const PAGE_BLOCK_DETAILS = (pageId: string) => `PAGE_BLOCK_DETAILS_${pageId}`
export const MY_PAGES_LIST = (pageId: string) => `MY_PAGE_LIST_${pageId}`

// estimates
export const ESTIMATES_LIST = (projectId: string) => `ESTIMATES_LIST_${projectId}`
export const ESTIMATE_DETAILS = (estimateId: string) => `ESTIMATE_DETAILS_${estimateId}`

// analytics
export const ANALYTICS = (workspaceSlug: string, params: IAnalyticsParams) =>
    `ANALYTICS${workspaceSlug.toUpperCase()}_${params.x_axis}_${params.y_axis}_${
        params.segment
    }_${params.project?.toString()}`
export const DEFAULT_ANALYTICS = (workspaceSlug: string, params?: Partial<IAnalyticsParams>) =>
    `DEFAULT_ANALYTICS_${workspaceSlug.toUpperCase()}_${params?.project?.toString()}_${params?.cycle}_${params?.module}`

// notifications
export const USER_WORKSPACE_NOTIFICATIONS = (workspaceSlug: string, params: INotificationParams) => {
    const { type, snoozed, archived, read } = params

    return `USER_WORKSPACE_NOTIFICATIONS_${workspaceSlug?.toUpperCase()}_TYPE_${(
        type ?? "assigned"
    )?.toUpperCase()}_SNOOZED_${snoozed}_ARCHIVED_${archived}_READ_${read}`
}

export const USER_WORKSPACE_NOTIFICATIONS_DETAILS = (workspaceSlug: string, notificationId: string) =>
    `USER_WORKSPACE_NOTIFICATIONS_DETAILS_${workspaceSlug?.toUpperCase()}_${notificationId?.toUpperCase()}`

export const UNREAD_NOTIFICATIONS_COUNT = (workspaceSlug: string) =>
    `UNREAD_NOTIFICATIONS_COUNT_${workspaceSlug?.toUpperCase()}`

export const getPaginatedNotificationKey = (index: number, prevData: any, workspaceSlug: string, params: any) => {
    if (prevData && !prevData?.results?.length) return null

    if (index === 0)
        return `/notification/${workspaceSlug}?${objToQueryParams({
            ...params,
            cursor: "30:0:0",
        })}`

    const cursor = prevData?.next_cursor
    const nextPageResults = prevData?.next_page_results

    if (!nextPageResults) return null

    return `/notification/${workspaceSlug}?${objToQueryParams({
        ...params,
        cursor,
    })}`
}

// profile
export const USER_PROFILE_DATA = (workspaceSlug: string, userId: string) =>
    `USER_PROFILE_ACTIVITY_${workspaceSlug.toUpperCase()}_${userId}`
export const USER_PROFILE_ACTIVITY = (workspaceSlug: string, userId: string) =>
    `USER_WORKSPACE_PROFILE_ACTIVITY_${workspaceSlug.toUpperCase()}_${userId}`
export const USER_PROFILE_PROJECT_SEGREGATION = (workspaceSlug: string, userId: string) =>
    `USER_PROFILE_PROJECT_SEGREGATION_${workspaceSlug.toUpperCase()}_${userId}`
export const USER_PROFILE_ISSUES = (workspaceSlug: string, userId: string, params: any) => {
    const paramsKey = myIssuesParamsToKey(params)

    return `USER_PROFILE_ISSUES_${workspaceSlug.toUpperCase()}_${userId}_${paramsKey}`
}

// reactions
export const ISSUE_REACTION_LIST = (workspaceSlug: string, projectId: string, issueId: string) =>
    `ISSUE_REACTION_LIST_${workspaceSlug.toUpperCase()}_${projectId}_${issueId}`
export const COMMENT_REACTION_LIST = (workspaceSlug: string, projectId: string, commendId: string) =>
    `COMMENT_REACTION_LIST_${workspaceSlug.toUpperCase()}_${projectId}_${commendId}`
