// Icons
import { AiOutlineApi, AiOutlineHome, AiOutlineInbox } from "react-icons/ai";

export const authRoutes = ["/login"];

export const wipRoutes = [
  "/calendar",
  "/documents",
  "/payments",
  "/time-tracking",
  "/reports",
];

export const sidebarOptions = [
  {
    name: "Dashboard",
    href: "/",
    icon: AiOutlineHome,
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: AiOutlineApi,
  },
  {
    name: "Inbox",
    href: "/inbox",
    icon: AiOutlineInbox,
  },
];
