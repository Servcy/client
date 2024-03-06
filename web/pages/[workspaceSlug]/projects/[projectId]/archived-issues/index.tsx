import { ReactElement } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
// layouts
import { AppLayout } from "@layouts/app-layout";

import { ArchivedIssueLayoutRoot } from "@components/issues";

import { ProjectArchivedIssuesHeader } from "@components/headers";
import { PageHead } from "@components/core";

import { NextPageWithLayout } from "@lib/types";

import { useProject } from "@hooks/store";

const ProjectArchivedIssuesPage: NextPageWithLayout = observer(() => {
  // router
  const router = useRouter();
  const { projectId } = router.query;
  // store hooks
  const { getProjectById } = useProject();
  // derived values
  const project = projectId ? getProjectById(projectId.toString()) : undefined;
  const pageTitle = project?.name && `${project?.name} - Archived issues`;

  return (
    <>
      <PageHead title={pageTitle} />
      <ArchivedIssueLayoutRoot />
    </>
  );
});

ProjectArchivedIssuesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout header={<ProjectArchivedIssuesHeader />} withProjectWrapper>
      {page}
    </AppLayout>
  );
};

export default ProjectArchivedIssuesPage;
