export const integrationCategories: Record<string, string[]> = {
    Github: ["Inbox"],
    Gmail: ["Inbox"],
    Outlook: ["Inbox"],
    Notion: ["Inbox"],
    Slack: ["Inbox"],
    Figma: ["Inbox"],
    Asana: ["Importer"],
    Jira: ["Importer"],
    Trello: ["Importer"],
}

export const integrationInboxCategories: Record<string, string[]> = {
    Github: ["notification", "comment", "archived"],
    Gmail: ["message", "archived"],
    Outlook: ["archived", "message"],
    Notion: ["archived", "comment", "notification"],
    Slack: ["archived", "message", "notification"],
    Figma: ["archived", "comment", "notification"],
    Asana: [],
    Trello: [],
    Jira: [],
}

export const uniqueIntegrationCategories = ["Inbox"]
