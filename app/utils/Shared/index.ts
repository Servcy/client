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
