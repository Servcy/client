export const getMicrosoftOauthUrl = (from: string) => {
  const scopes = ["User.Read", "Mail.Read", "openid", "profile", "email"];
  const options = [
    ["client_id", process.env["NEXT_PUBLIC_MICROSOFT_CLIENT_ID"] ?? ""],
    ["response_type", "code"],
    ["redirect_uri", process.env["NEXT_PUBLIC_MICROSOFT_REDIRECT_URI"] ?? ""],
    ["state", from],
    ["scope", scopes.join(" ")],
    ["response_mode", "query"],
    ["prompt", "consent"],
  ];
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams(
    options
  )}`;
};

export const getGoogleOauthUrl = (from: string) => {
  const options = [
    ["redirect_uri", process.env["NEXT_PUBLIC_GOOGLE_REDIRECT_URI"] ?? ""],
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

export const getNotionOauthUrl = (from: string) => {
  return `https://api.notion.com/v1/oauth/authorize?${new URLSearchParams([
    ["client_id", process.env["NEXT_PUBLIC_NOTION_CLIENT_ID"] ?? ""],
    ["redirect_uri", process.env["NEXT_PUBLIC_NOTION_REDIRECT_URI"] ?? ""],
    ["response_type", "code"],
    ["owner", "user"],
    ["state", from],
  ])}`;
};
