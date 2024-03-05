export const getQueryParams = (search: string) => {
  const params = new URLSearchParams(search);
  return Array.from(params.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

export function isMobileDevice(userAgent: string): boolean {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  return isMobile;
}

export function getCleanLink(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  /*
    Input: https://example.com/path/to/resource?param=value#section
    Outputs: https://example.com/path/to/resource
    Return the clean link (host + pathname) without query parameters, or fragment
  */
  return anchor.protocol + "//" + anchor.host + anchor.pathname;
}
