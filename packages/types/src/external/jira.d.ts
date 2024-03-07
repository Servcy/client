export interface JiraNotificationData {
    issue: JiraIssue
    issue_event_type_name: string
    comment?: JiraComment
    changelog?: JiraChangelog
    webhookEvent: string
    user: JiraUser
    matchedWebhookIds: number[]
    timestamp: number
}

export interface JiraChangelog {
    id: string
    items: JiraItem[]
}

export interface JiraItem {
    field: string
    fieldtype: string
    fieldId: string
    from?: string
    fromString?: string
    to: string
    toString: string
    tmpFromAccountId?: string
    tmpToAccountId: string
}

export interface JiraIssue {
    id: string
    self: string
    key: string
    fields: JiraFields
}

export interface JiraFields {
    statuscategorychangedate: string
    issuetype?: JiraIssuetype
    timespent?: string
    project?: JiraProject
    fixVersions: any[]
    aggregatetimespent?: string
    resolution?: string
    resolutiondate?: string
    workratio: number
    watches: JiraWatches
    lastViewed?: string
    issuerestriction: JiraIssuerestriction
    created: string
    priority?: JiraPriority
    labels: any[]
    aggregatetimeoriginalestimate?: string
    timeestimate?: string
    versions: any[]
    issuelinks: any[]
    assignee?: JiraUser
    updated: string
    status?: JiraStatus
    components: any[]
    timeoriginalestimate?: string
    description?: string
    timetracking: JiraTimetracking
    security?: string
    aggregatetimeestimate?: string
    attachment: any[]
    summary: string
    creator: JiraUser
    subtasks: any[]
    reporter: JiraUser
    aggregateprogress: JiraProgress
    environment?: string
    duedate?: string
    progress: JiraProgress
    votes: JiraVotes
}

export interface JiraProgress {
    progress: number
    total: number
}

export interface JiraUser {
    self: string
    accountId: string
    avatarUrls: JiraAvatarUrls
    displayName: string
    active: boolean
    timeZone: string
    accountType: string
}

export interface JiraIssuerestriction {
    issuerestrictions: JiraTimetracking
    shouldDisplay: boolean
}

export interface JiraTimetracking {}

export interface JiraIssuetype {
    self: string
    id: string
    description: string
    iconUrl: string
    name: string
    subtask: boolean
    avatarId: number
    entityId: string
    hierarchyLevel: number
}

export interface JiraPriority {
    self: string
    iconUrl: string
    name: string
    id: string
}

export interface JiraProject {
    self: string
    id: string
    key: string
    name: string
    projectTypeKey: string
    simplified: boolean
    avatarUrls: JiraAvatarUrls
}

export interface JiraStatus {
    self: string
    description: string
    iconUrl: string
    name: string
    id: string
    statusCategory: JiraStatusCategory
}

export interface JiraStatusCategory {
    self: string
    id: number
    key: string
    colorName: string
    name: string
}

export interface JiraVotes {
    self: string
    votes: number
    hasVoted: boolean
}

export interface JiraWatches {
    self: string
    watchCount: number
    isWatching: boolean
}

export interface JiraComment {
    self: string
    id: string
    author: JiraAuthor
    body: string
    updateAuthor: JiraAuthor
    created: string
    updated: string
    jsdPublic: boolean
}

export interface JiraAuthor {
    self: string
    accountId: string
    avatarUrls: JiraAvatarUrls
    displayName: string
    active: boolean
    timeZone: string
    accountType: string
}

export interface JiraAvatarUrls {
    "48x48": string
    "24x24": string
    "16x16": string
    "32x32": string
}

export interface JiraNotificationProps {
    data: JiraNotificationData
    cause: JiraUser
}
