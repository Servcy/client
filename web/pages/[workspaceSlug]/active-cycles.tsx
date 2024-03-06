import { observer } from "mobx-react";
import { ReactElement } from "react";

import { PageHead } from "@components/core";
import { WorkspaceActiveCycleHeader } from "@components/headers";
import { WorkspaceActiveCyclesUpgrade } from "@components/workspace";

import { AppLayout } from "@layouts/app-layout";

import { NextPageWithLayout } from "@/types/types";

import { useWorkspace } from "@hooks/store";

const WorkspaceActiveCyclesPage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Active Cycles` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      <WorkspaceActiveCyclesUpgrade />
    </>
  );
});

WorkspaceActiveCyclesPage.getWrapper = function getWrapper(page: ReactElement) {
  return <AppLayout header={<WorkspaceActiveCycleHeader />}>{page}</AppLayout>;
};

export default WorkspaceActiveCyclesPage;
