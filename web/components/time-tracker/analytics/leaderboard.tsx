import emptyUsers from "public/empty-state/empty_users.svg"

import { ProfileEmptyState } from "@components/ui"

import { convertSecondsToReadableTime } from "@helpers/date-time.helper"

type Props = {
    users: {
        avatar: string | null
        display_name: string | null
        firstName: string
        lastName: string
        sum: string
        id: string
    }[]
    title: string
    emptyStateMessage: string
    workspaceSlug: string
}

export const TimesheetLeaderBoard: React.FC<Props> = ({ users, title, emptyStateMessage, workspaceSlug }) => (
    <div className="rounded-[10px] border border-custom-border-200 p-3">
        <h6 className="text-base font-medium">{title}</h6>
        {users.length > 0 ? (
            <div className="mt-6 space-y-3">
                {users.map((user) => (
                    <a
                        key={user.display_name ?? "None"}
                        href={`/${workspaceSlug}/profile/${user.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-4 text-xs"
                    >
                        <div className="flex items-center gap-2">
                            {user && user.avatar && user.avatar !== "" ? (
                                <div className="relative size-5 flex-shrink-0 rounded-full">
                                    <img
                                        src={user.avatar}
                                        className="absolute left-0 top-0 h-full w-full rounded-full object-cover"
                                        alt={user.display_name ?? "None"}
                                    />
                                </div>
                            ) : (
                                <div className="grid size-5 flex-shrink-0 place-items-center rounded-full bg-gray-700 text-[11px] capitalize text-white">
                                    {user.display_name !== "" ? user?.display_name?.[0] : "?"}
                                </div>
                            )}
                            <span className="break-words text-custom-text-200">
                                {user.display_name !== "" ? `${user.display_name}` : "No assignee"}
                            </span>
                        </div>
                        <span className="flex-shrink-0 bg-custom-background-80 text-custom-text-200 rounded-3xl px-2 py-1.5 text-md">
                            {convertSecondsToReadableTime(user.sum)}
                        </span>
                    </a>
                ))}
            </div>
        ) : (
            <div className="px-7 py-4">
                <ProfileEmptyState title="No Data yet" description={emptyStateMessage} image={emptyUsers} />
            </div>
        )}
    </div>
)
