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
