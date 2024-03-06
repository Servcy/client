import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { FC, ReactNode, useEffect, useState } from "react";
// mobx store provider
import { IUser } from "@servcy/types";

import { getUserRole } from "@helpers/user.helper";

import { GROUP_WORKSPACE } from "@constants/event-tracker";

export interface IPosthogWrapper {
  children: ReactNode;
  user: IUser | null;
  currentWorkspaceId: string | undefined;
  workspaceRole: number | undefined;
  projectRole: number | undefined;
  posthogAPIKey: string;
  posthogHost: string | null;
}

const PostHogProvider: FC<IPosthogWrapper> = (props) => {
  const { children, user, workspaceRole, currentWorkspaceId, projectRole } = props;
  // states
  const [lastWorkspaceId, setLastWorkspaceId] = useState(currentWorkspaceId);
  // router
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Identify sends an event, so you want may want to limit how often you call it
      posthog?.identify(user.email, {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        use_case: user.use_case,
        workspace_role: workspaceRole ? getUserRole(workspaceRole) : undefined,
        project_role: projectRole ? getUserRole(projectRole) : undefined,
      });
    }
  }, [user, workspaceRole, projectRole]);

  useEffect(() => {
  }, []);

  useEffect(() => {
    // Join workspace group on workspace change
    if (lastWorkspaceId !== currentWorkspaceId && currentWorkspaceId && user) {
      setLastWorkspaceId(currentWorkspaceId);
      posthog?.identify(user.email);
      posthog?.group(GROUP_WORKSPACE, currentWorkspaceId);
    }
  }, [currentWorkspaceId, lastWorkspaceId, user]);

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => {
      posthog?.capture("$pageview");
    };
    posthog.init(process.env["NEXT_PUBLIC_POSTHOG_ID"], {
      api_host: process.env["NEXT_PUBLIC_POSTHOG_HOST"],
      autocapture: false,
      capture_pageview: false,
    });
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
};

export default PostHogProvider;
