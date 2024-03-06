import { ReactElement } from "react";
import { observer } from "mobx-react";

import { AppLayout } from "@layouts/app-layout";
import { WorkspaceSettingLayout } from "@layouts/settings-layout";

import { useWorkspace } from "@hooks/store";

import { WorkspaceSettingHeader } from "@components/headers";
import { WorkspaceDetails } from "@components/workspace";
import { PageHead } from "@components/core";

import { NextPageWithLayout } from "@/types/types";

const WorkspaceSettingsPage: NextPageWithLayout = observer(() => {
  // store hooks
  const { currentWorkspace } = useWorkspace();
  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - General Settings` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      <WorkspaceDetails />
    </>
  );
});

WorkspaceSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout header={<WorkspaceSettingHeader title="General Settings" />}>
      <WorkspaceSettingLayout>{page}</WorkspaceSettingLayout>
    </AppLayout>
  );
};

export default WorkspaceSettingsPage;
