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
};

// TODO: Reconsider in the future
// export const integrationCategories: Record<string, string[]> = {
//   Github: ["Inbox"],
//   Gmail: ["Inbox", "Calendar", "Document"],
//   Outlook: ["Inbox", "Calendar", "Document"],
//   Notion: ["Inbox", "Document"],
//   Slack: ["Inbox", "Document"],
//   Figma: ["Inbox", "Document"],
//   Monday: ["Document", "Inbox"],
//   Asana: ["Document", "Inbox"],
//   Trello: ["Document", "Inbox"],
//   Jira: ["Document", "Inbox"],
//   Airtable: ["Document", "Inbox"],
//   Dropbox: ["Document"],
//   ClickUp: ["Document", "Inbox"],
//   SmartSheet: ["Document", "Inbox"],
//   Wise: ["Payment"],
//   Stripe: ["Payment"],
//   PayPal: ["Payment"],
//   DocuSign: ["Document"],
//   Ironclad: ["Document"],
//   QuickBook: ["Document"],
//   Calendly: ["Calendar"],
// };

export const uniqueIntegrationCategories = [
  ...new Set(Object.values(integrationCategories).flat()),
];
