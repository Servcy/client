export const integrationCategories: Record<string, string[]> = {
  Github: ["Inbox"],
  Gmail: ["Inbox"],
  Outlook: ["Inbox"],
  Notion: ["Inbox"],
  Slack: ["Inbox"],
  Figma: ["Inbox"],
  Asana: ["Inbox"],
  Trello: ["Inbox"],
};

export const integrationInboxCategories: Record<string, string[]> = {
  Github: ["notification", "comment", "archived"],
  Gmail: ["message", "archived"],
  Outlook: ["archived", "message"],
  Notion: ["archived", "comment", "notification"],
  Slack: ["archived", "message", "notification"],
  Figma: ["archived", "comment", "notification"],
  Asana: ["archived", "comment", "notification"],
  Trello: ["archived", "comment", "notification"],
  Atlassian: ["archived", "comment", "notification"],
};

export const uniqueIntegrationCategories = [
  ...new Set(Object.values(integrationCategories).flat()),
];
