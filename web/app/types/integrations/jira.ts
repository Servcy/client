export interface JiraNotificationData {
    issue: Issue;
    issue_event_type_name: string;
    comment?: Comment;
    changelog?: Changelog;
    webhookEvent: string;
    user: User;
    matchedWebhookIds: number[];
    timestamp: number;
}

export interface Changelog {
    id: string;
    items: Item[];
}

export interface Item {
    field: string;
    fieldtype: string;
    fieldId: string;
    from?: string;
    fromString?: string;
    to: string;
    toString: string;
    tmpFromAccountId?: string;
    tmpToAccountId: string;
}

export interface Issue {
    id: string;
    self: string;
    key: string;
    fields: Fields;
}

export interface Fields {
    statuscategorychangedate: string;
    issuetype?: Issuetype;
    timespent?: string;
    project?: Project;
    fixVersions: any[];
    aggregatetimespent?: string;
    resolution?: string;
    resolutiondate?: string;
    workratio: number;
    watches: Watches;
    lastViewed?: string;
    issuerestriction: Issuerestriction;
    created: string;
    priority?: Priority;
    labels: any[];
    aggregatetimeoriginalestimate?: string;
    timeestimate?: string;
    versions: any[];
    issuelinks: any[];
    assignee?: User;
    updated: string;
    status?: Status;
    components: any[];
    timeoriginalestimate?: string;
    description?: string;
    timetracking: Timetracking;
    security?: string;
    aggregatetimeestimate?: string;
    attachment: any[];
    summary: string;
    creator: User;
    subtasks: any[];
    reporter: User;
    aggregateprogress: Progress;
    environment?: string;
    duedate?: string;
    progress: Progress;
    votes: Votes;
}

export interface Progress {
    progress: number;
    total: number;
}

export interface User {
    self: string;
    accountId: string;
    avatarUrls: AvatarUrls;
    displayName: string;
    active: boolean;
    timeZone: string;
    accountType: string;
}

export interface Issuerestriction {
    issuerestrictions: Timetracking;
    shouldDisplay: boolean;
}

export interface Timetracking {}

export interface Issuetype {
    self: string;
    id: string;
    description: string;
    iconUrl: string;
    name: string;
    subtask: boolean;
    avatarId: number;
    entityId: string;
    hierarchyLevel: number;
}

export interface Priority {
    self: string;
    iconUrl: string;
    name: string;
    id: string;
}

export interface Project {
    self: string;
    id: string;
    key: string;
    name: string;
    projectTypeKey: string;
    simplified: boolean;
    avatarUrls: AvatarUrls;
}

export interface Status {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: StatusCategory;
}

export interface StatusCategory {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: string;
}

export interface Votes {
    self: string;
    votes: number;
    hasVoted: boolean;
}

export interface Watches {
    self: string;
    watchCount: number;
    isWatching: boolean;
}

export interface Comment {
    self: string;
    id: string;
    author: Author;
    body: string;
    updateAuthor: Author;
    created: string;
    updated: string;
    jsdPublic: boolean;
}

export interface Author {
    self: string;
    accountId: string;
    avatarUrls: AvatarUrls;
    displayName: string;
    active: boolean;
    timeZone: string;
    accountType: string;
}

export interface AvatarUrls {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
}

export interface JiraNotificationProps {
    data: JiraNotificationData;
    cause: User;
}
