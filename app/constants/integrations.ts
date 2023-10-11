export const integrationCategories: Record<string, string[]> = {
  Github: ["Inbox", "Project"],
  Gmail: ["Inbox", "Calendar", "Documents", "Project"],
  Outlook: ["Inbox", "Calendar", "Documents", "Project"],
  Notion: ["Inbox", "Documents", "Project"],
  Slack: ["Inbox", "Documents"],
  Figma: ["Inbox", "Documents"],
  Monday: ["Documents", "Project", "Inbox"],
  Asana: ["Documents", "Project", "Inbox"],
  Trello: ["Documents", "Project", "Inbox"],
  Jira: ["Documents", "Project", "Inbox"],
  Airtable: ["Documents", "Project", "Inbox"],
  Dropbox: ["Documents"],
  ClickUp: ["Documents", "Project", "Inbox"],
  SmartSheet: ["Documents", "Project", "Inbox"],
  Wise: ["Payments"],
  Stripe: ["Payments"],
  PayPal: ["Payments"],
  DocuSign: ["Documents"],
  Ironclad: ["Documents"],
  QuickBook: ["Documents"],
  Calendly: ["Calendar"],
};

export const uniqueIntegrationCategories = [
  ...new Set(Object.values(integrationCategories).flat()),
];
