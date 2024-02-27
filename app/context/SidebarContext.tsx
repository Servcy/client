"use client";

import type { SidebarContextProps } from "@/types/sidebar";
import { isBrowser, isSmallScreen } from "@/utils/Shared";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const location = isBrowser() ? window.location.pathname : "/";
  const [isOpen, setOpen] = useState(false);
  const [isPageWithSidebar, setIsPageWithSidebar] = useState(true);

  // Close Sidebar on page change on mobile
  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  // Close Sidebar on mobile tap inside main content
  useEffect(() => {
    function handleMobileTapInsideMain(event: MouseEvent) {
      const main = document.querySelector("main");
      const isClickInsideMain = main?.contains(event.target as Node);

      if (isSmallScreen() && isClickInsideMain) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMobileTapInsideMain);
    return () => {
      document.removeEventListener("mousedown", handleMobileTapInsideMain);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpenOnSmallScreens: isOpen,
        isPageWithSidebar: isPageWithSidebar,
        setIsPageWithSidebar: setIsPageWithSidebar,
        setOpenOnSmallScreens: setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext) as SidebarContextProps | undefined;

  if (!context) {
    throw new Error(
      "useSidebarContext should be used within the SidebarContext provider!"
    );
  }

  return context;
}
