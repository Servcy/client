import { observer } from "mobx-react";
import { ReactElement } from "react";

import { PageHead } from "@components/core";
import { ProjectsHeader } from "@components/headers";
import { ProjectCardList } from "@components/project";

import { AppLayout } from "@layouts/app-layout";
// type
import { NextPageWithLayout } from "@/types/types";
import { useWorkspace } from "@hooks/store";

const ProjectsPage: NextPageWithLayout = observer(() => {
  // store
  const { currentWorkspace } = useWorkspace();
  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Projects` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      <ProjectCardList />
    </>
  );
});

ProjectsPage.getWrapper = function getWrapper(page: ReactElement) {
  return <AppLayout header={<ProjectsHeader />}>{page}</AppLayout>;
};

export default ProjectsPage;
