export const getQueryParams = (search: string) => {
  const params = new URLSearchParams(search);
  return Array.from(params.entries()).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
};

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isSmallScreen(): boolean {
  return isBrowser() && window.innerWidth < 1024;
}

export function getCleanLink(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  // Input: https://example.com/path/to/resource?param=value#section
  //  Outputs: https://example.com/path/to/resource
  // Return the clean link (host + pathname) without query parameters, or fragment
  return anchor.protocol + "//" + anchor.host + anchor.pathname;
}
