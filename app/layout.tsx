"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";
// Components
import SideBar from "@/components/Shared/sidebar";
import { SyncOutlined } from "@ant-design/icons";
import { Analytics } from "@vercel/analytics/react";
import { Spin } from "antd";
import { Toaster } from "react-hot-toast";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
// Context
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
// Styles
import "@/styles/globals.css";
// Utils
import { isSmallScreen } from "@/utils/Shared";
import cn from "classnames";
import { deleteCookie } from "cookies-next";
// APIs
import { logout as logoutApi } from "@/apis/logout";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <GoogleOAuthProvider
          clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}
        >
          <SidebarProvider>
            <ContentWithSidebar>
              {children}
              <Analytics />
            </ContentWithSidebar>
          </SidebarProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

const ContentWithSidebar: FC<PropsWithChildren> = function ({ children }) {
  const { isPageWithSidebar, isOpenOnSmallScreens, setOpenOnSmallScreens } =
    useSidebarContext();
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      setLoading(true);
      await logoutApi();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    } finally {
      setTimeout(() => {
        setLoading(false);
        window.location.href = "/";
      }, 1000);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex">
      {loading ? (
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
      ) : (
        children
      )}
      {isPageWithSidebar ? (
        <>
          <div
            className={cn("order-1", {
              hidden: isSmallScreen() && !isOpenOnSmallScreens,
            })}
          >
            <SideBar logout={logout} />
          </div>
          {isSmallScreen() && !isOpenOnSmallScreens && (
            <AiOutlineMenu
              className="fixed bottom-5 right-5 cursor-pointer rounded-full bg-servcy-black p-2 text-4xl text-servcy-white"
              onClick={() => {
                setOpenOnSmallScreens(true);
              }}
            />
          )}
          {isSmallScreen() && isOpenOnSmallScreens && (
            <AiOutlineClose
              className="fixed bottom-5 right-5 cursor-pointer rounded-full bg-servcy-black p-2 text-4xl text-servcy-white"
              onClick={() => {
                setOpenOnSmallScreens(false);
              }}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default RootLayout;
