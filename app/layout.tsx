"use client";
// Type definitions for flowbite 1.0.0
import { FC, PropsWithChildren } from "react";
// Components
import Sidebar from "@/components/Shared/sidebar";
import { Toaster } from "react-hot-toast";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
// Context
import FlowbiteProvider from "@/context/FlowbiteContext";
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
        <FlowbiteProvider>
          <Toaster />
          <SidebarProvider>
            <ContentWithSidebar>{children}</ContentWithSidebar>
          </SidebarProvider>
        </FlowbiteProvider>
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
        <div
          className={cn("order-1", {
            hidden: isSmallScreen() && !isOpenOnSmallScreens,
          })}
        >
          <Sidebar />
        </div>
      ) : null}
      {isSmallScreen() && !isOpenOnSmallScreens && (
        <AiOutlineMenu
          className="fixed bottom-5 right-5 cursor-pointer rounded-full bg-gray-900 p-2 text-4xl text-white"
          onClick={() => {
            setOpenOnSmallScreens(true);
          }}
        />
      )}
      {isSmallScreen() && isOpenOnSmallScreens && (
        <AiOutlineClose
          className="fixed bottom-5 right-5 cursor-pointer rounded-full bg-gray-900 p-2 text-4xl text-white"
          onClick={() => {
            setOpenOnSmallScreens(false);
          }}
        />
      )}
    </div>
  );
};

export default RootLayout;
