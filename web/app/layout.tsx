"use client";
import dynamic from "next/dynamic";
import { logout as logoutApi } from "@/apis/logout";
import Blocked from "@/components/Shared/blocked";
import Router from "next/router";
import NProgress from "nprogress";
import SideBar from "@/components/Shared/sidebar";
import "@/styles/globals.css";
import { isMobileDevice } from "@/utils/Shared";
import { SyncOutlined } from "@ant-design/icons";
import { SWR_CONFIG } from "@constants/swr-config";
import { THEMES } from "@constants/themes";
import { useUser, useWorkspace } from "@hooks/store";
import { StoreProvider } from "@contexts/StoreContext";
import InstanceLayout from "@layouts/instance-layout";
import { googleLogout, GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import { Spin } from "antd";
import { deleteCookie, getCookie } from "cookies-next";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";


// dynamic imports
const StoreWrapper = dynamic(() => import("@wrappers/StoreWrapper"), { ssr: false });
const PostHogProvider = dynamic(() => import("@contexts/PosthogContext"), { ssr: false });
const CrispWrapper = dynamic(() => import("@wrappers/CrispWrapper"), { ssr: false });

// nprogress
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeError", NProgress.done);
Router.events.on("routeChangeComplete", NProgress.done);

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  const {
    currentUser,
    membership: { currentProjectRole, currentWorkspaceRole },
  } = useUser();
  const { currentWorkspace } = useWorkspace();

  return (
    <html lang="en">
      <body>
        <Toaster />
        <GoogleOAuthProvider clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}>
          <StoreProvider>
            <ThemeProvider themes={THEMES} defaultTheme="system">
              <InstanceLayout>
                <StoreWrapper>
                  <CrispWrapper user={currentUser}>
                    <PostHogProvider
                      user={currentUser}
                      currentWorkspaceId={currentWorkspace?.id}
                      workspaceRole={currentWorkspaceRole}
                      projectRole={currentProjectRole}
                    >
                      <SWRConfig value={SWR_CONFIG}>
                        <LayoutWrapper>
                          {children}
                          <Analytics />
                        </LayoutWrapper>
                      </SWRConfig>
                    </PostHogProvider>
                  </CrispWrapper>
                </StoreWrapper>
              </InstanceLayout>
            </ThemeProvider>
          </StoreProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

const LayoutWrapper: FC<PropsWithChildren> = function ({ children }) {
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      setLoading(true);
      const refresh_token = getCookie("refreshToken");
      await logoutApi(String(refresh_token));
      googleLogout();
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading)
    return (
      <div className="flex h-screen justify-center">
        <Spin
          className="order-2 m-auto"
          size="large"
          indicator={
            <SyncOutlined
              spin
              style={{
                color: "#26542F",
              }}
            />
          }
        />
      </div>
    );
  if (isMobileDevice(navigator.userAgent))
    return (
      <div className="flex h-screen justify-center">
        <Blocked />
      </div>
    );
  return (
    <div className="flex">
      {children}
      <div className="order-1">
        <SideBar logout={logout} />
      </div>
    </div>
  );
};

export default RootLayout;
