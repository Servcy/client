import type { AuthUserContextProps } from "@/types/auth/authUser";
import { createContext, PropsWithChildren, useContext } from "react";
export const AuthUserContext = createContext<AuthUserContextProps>(undefined!);

export function SidebarProvider({ children }: PropsWithChildren<Record<string, unknown>>) {
  return <AuthUserContext.Provider value={{}}>{children}</AuthUserContext.Provider>;
}

export function useAuthUserContext(): AuthUserContextProps {
  const context = useContext(AuthUserContext) as AuthUserContextProps | undefined;

  if (!context) {
    throw new Error("useAuthUserContext should be used within the AuthUserContext provider!");
  }

  return context;
}
