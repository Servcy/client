export const getQueryParams = (search: string) => {
  const params = new URLSearchParams(search);
  return Array.from(params.entries()).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
};
