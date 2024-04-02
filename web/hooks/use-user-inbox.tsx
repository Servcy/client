import useSWR from "swr"

import InboxService from "@services/inbox.service"

const inboxService = new InboxService()

interface UseUserInbox {
    totalUnreadCount: number | null
    unreadCount: any
    mutateUnreadCount: () => void
}

const useUserInbox = (): UseUserInbox => {
    const { data: unreadCount, mutate: mutateUnreadCount } = useSWR("UNREAD_INBOX_NOTIFICATIONS_COUNT", () =>
        inboxService.fetchInboxUnreadCount()
    )

    return {
        totalUnreadCount: unreadCount ? unreadCount.message + unreadCount.notification + unreadCount.comment : null,
        unreadCount,
        mutateUnreadCount,
    }
}

export default useUserInbox
