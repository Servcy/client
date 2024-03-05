"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";
// Components
import Blocked from "@/components/Shared/blocked";
import SideBar from "@/components/Shared/sidebar";
import { SyncOutlined } from "@ant-design/icons";
import { Analytics } from "@vercel/analytics/react";
import { Spin } from "antd";
import { Toaster } from "react-hot-toast";
// Context
import { GoogleOAuthProvider } from "@react-oauth/google";
// Styles
import "@/styles/globals.css";
// Utils
import { isMobileDevice } from "@/utils/Shared";
import { googleLogout } from "@react-oauth/google";
import { deleteCookie, getCookie } from "cookies-next";
// APIs
import { logout as logoutApi } from "@/apis/logout";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <GoogleOAuthProvider clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}>
          <ContentWithSidebar>
            {children}
            <Analytics />
          </ContentWithSidebar>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

const ContentWithSidebar: FC<PropsWithChildren> = function ({ children }) {
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
