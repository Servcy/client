export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getWrapper?: (page: ReactElement) => ReactNode;
};
