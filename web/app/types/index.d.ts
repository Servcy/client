export type NextPageWithWrapper<P = {}, IP = P> = NextPage<P, IP> & {
    hasWrapper?: boolean
}
