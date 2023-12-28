export const integrationCategories: Record<string, string[]> = {
  Github: ["Inbox"],
  Gmail: ["Inbox", "Calendar", "Document"],
  Outlook: ["Inbox", "Calendar", "Document"],
  Notion: ["Inbox", "Document"],
  Slack: ["Inbox", "Document"],
  Figma: ["Inbox", "Document"],
  Monday: ["Document", "Inbox"],
  Asana: ["Document", "Inbox"],
  Trello: ["Document", "Inbox"],
  Jira: ["Document", "Inbox"],
  Airtable: ["Document", "Inbox"],
  Dropbox: ["Document"],
  ClickUp: ["Document", "Inbox"],
  SmartSheet: ["Document", "Inbox"],
  Wise: ["Payment"],
  Stripe: ["Payment"],
  PayPal: ["Payment"],
  DocuSign: ["Document"],
  Ironclad: ["Document"],
  QuickBook: ["Document"],
  Calendly: ["Calendar"],
};

export const uniqueIntegrationCategories = [
  ...new Set(Object.values(integrationCategories).flat()),
];
