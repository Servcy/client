const getMicrosoftOauthUrl = (from: string) => {
  const scopes = ["User.Read", "Mail.Read", "openid", "profile", "email"];
  const options = [
    ["client_id", process.env["NEXT_PUBLIC_MICROSOFT_CLIENT_ID"] ?? ""],
    ["response_type", "code"],
    [
      "redirect_uri",
      `${process.env["NEXT_PUBLIC_CLIENT_URL"]}/integrations/microsoft/oauth`,
    ],
    ["state", from],
    ["scope", scopes.join(" ")],
    ["response_mode", "query"],
    ["prompt", "consent"],
  ];
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams(
    options
  )}`;
};

const getGoogleOauthUrl = (from: string) => {
  const options = [
    [
      "redirect_uri",
      `${process.env["NEXT_PUBLIC_CLIENT_URL"]}/integrations/google/oauth`,
    ],
    ["client_id", process.env["NEXT_PUBLIC_GOOGLE_CLIENT_ID"] ?? ""],
    ["access_type", "offline"],
    ["response_type", "code"],
    ["prompt", "consent"],
    [
      "scope",
      [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    ],
    ["state", from],
  ];
  return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    options
  )}`;
};

const getNotionOauthUrl = (from: string) => {
  return `https://api.notion.com/v1/oauth/authorize?${new URLSearchParams([
    ["client_id", process.env["NEXT_PUBLIC_NOTION_CLIENT_ID"] ?? ""],
    [
      "redirect_uri",
      `${process.env["NEXT_PUBLIC_CLIENT_URL"]}/integrations/notion/oauth`,
    ],
    ["response_type", "code"],
    ["owner", "user"],
    ["state", from],
  ])}`;
};

const getSlackOauthUrl = (from: string) => {
  return `https://slack.com/oauth/v2/authorize?${new URLSearchParams([
    ["client_id", process.env["NEXT_PUBLIC_SLACK_CLIENT_ID"] ?? ""],
    [
      "redirect_uri",
      `${process.env["NEXT_PUBLIC_CLIENT_URL"]}/integrations/slack/oauth`,
    ],
    [
      "user_scope",
      "channels:history,chat:write,files:read,groups:history,im:history,mpim:history,pins:read,reactions:read,usergroups:read",
    ],
    ["state", from],
  ])}`;
};

const getFigmaOauthUrl = (from: string) => {
  return `https://www.figma.com/oauth?${new URLSearchParams([
    ["client_id", process.env["NEXT_PUBLIC_FIGMA_CLIENT_ID"] ?? ""],
    ["response_type", "code"],
    [
      "redirect_uri",
      `${process.env["NEXT_PUBLIC_CLIENT_URL"]}/integrations/figma/oauth`,
    ],
    ["scope", "files:read,file_comments:write,webhooks:write"],
    ["state", from],
  ])}`;
};

const getGithubOauthUrl = (from: string) => {
  return `https://github.com/login/oauth/authorize${new URLSearchParams([
    ["client_id", process.env["NEXT_PUBLIC_GITHUB_CLIENT_ID"] ?? ""],
    [
      "redirect_uri",
      `${process.env["NEXT_PUBLIC_CLIENT_URL"]}/integrations/github/oauth`,
    ],
    ["state", from],
  ])}`;
};

export const oauthUrlGenerators: Record<string, Function> = {
  Gmail: getGoogleOauthUrl,
  Outlook: getMicrosoftOauthUrl,
  Notion: getNotionOauthUrl,
  Slack: getSlackOauthUrl,
  Github: getGithubOauthUrl,
  Figma: getFigmaOauthUrl,
};
