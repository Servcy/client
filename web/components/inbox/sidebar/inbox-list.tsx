import { FC } from "react";
import { observer } from "mobx-react";

import { useInboxIssues } from "@hooks/store";
// components
import { InboxIssueListItem } from "../";

type TInboxIssueList = { workspaceSlug: string; projectId: string; inboxId: string };

export const InboxIssueList: FC<TInboxIssueList> = observer((props) => {
  const { workspaceSlug, projectId, inboxId } = props;
  
  const {
    issues: { getInboxIssuesByInboxId },
  } = useInboxIssues();

  const inboxIssueIds = getInboxIssuesByInboxId(inboxId);

  if (!inboxIssueIds) return <></>;
  return (
    <div className="overflow-y-auto w-full h-full vertical-scrollbar scrollbar-md">
      {inboxIssueIds.map((issueId) => (
        <InboxIssueListItem workspaceSlug={workspaceSlug} projectId={projectId} inboxId={inboxId} issueId={issueId} />
      ))}
    </div>
  );
});
