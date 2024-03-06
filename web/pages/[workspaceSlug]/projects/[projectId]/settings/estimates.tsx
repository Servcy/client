import { observer } from "mobx-react-lite";
import { ReactElement } from "react";

import { useProject, useUser } from "@hooks/store";

import { AppLayout } from "@layouts/app-layout";
import { ProjectSettingLayout } from "@layouts/settings-layout";

import { PageHead } from "@components/core";
import { EstimatesList } from "@components/estimates";
import { ProjectSettingHeader } from "@components/headers";

import { NextPageWithLayout } from "@/types/types";

import { EUserProjectRoles } from "@constants/project";

const EstimatesSettingsPage: NextPageWithLayout = observer(() => {
  const {
    membership: { currentProjectRole },
  } = useUser();
  const { currentProjectDetails } = useProject();
  // derived values
  const isAdmin = currentProjectRole === EUserProjectRoles.ADMIN;
  const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails?.name} - Estimates` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      <div className={`h-full w-full overflow-y-auto py-8 pr-9 ${isAdmin ? "" : "pointer-events-none opacity-60"}`}>
        <EstimatesList />
      </div>
    </>
  );
});

EstimatesSettingsPage.getWrapper = function getWrapper(page: ReactElement) {
  return (
    <AppLayout header={<ProjectSettingHeader title="Estimates Settings" />} withProjectWrapper>
      <ProjectSettingLayout>{page}</ProjectSettingLayout>
    </AppLayout>
  );
};

export default EstimatesSettingsPage;
