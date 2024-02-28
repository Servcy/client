import type { SidebarContextProps } from "@/types/sidebar";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const [isPageWithSidebar, setIsPageWithSidebar] = useState(true);

  return (
    <SidebarContext.Provider
      value={{
        isPageWithSidebar: isPageWithSidebar,
        setIsPageWithSidebar: setIsPageWithSidebar,
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
