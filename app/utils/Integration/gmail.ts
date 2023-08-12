export const getGoogleUrl = (from: string) => {
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
