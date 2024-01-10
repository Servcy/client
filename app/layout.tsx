"use client";
import { FC, PropsWithChildren } from "react";
// Components
import Sidebar from "@/components/Shared/sidebar";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
// Context
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
// Styles
import "@/styles/globals.css";
// Utils
import { isSmallScreen } from "@/utils/Shared";
import cn from "classnames";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <SidebarProvider>
          <ContentWithSidebar>
            {children}
            <Analytics />
          </ContentWithSidebar>
        </SidebarProvider>
      </body>
    </html>
  );
};

const ContentWithSidebar: FC<PropsWithChildren> = function ({ children }) {
  const { isPageWithSidebar, isOpenOnSmallScreens, setOpenOnSmallScreens } =
    useSidebarContext();

  return (
    <div className="flex">
      {children}
      {isPageWithSidebar ? (
        <>
          <div
            className={cn("order-1", {
              hidden: isSmallScreen() && !isOpenOnSmallScreens,
            })}
          >
            <Sidebar />
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
