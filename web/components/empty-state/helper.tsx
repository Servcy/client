export const getEmptyStateImagePath = (category: string, type: string, isLightMode: boolean) =>
    `/empty-state/${category}/${type}-${isLightMode ? "light" : "dark"}.webp`

export const getEmptyStateImage = (path: string, isLightMode: boolean) =>
    `${path}-${isLightMode ? "light" : "dark"}.webp`
