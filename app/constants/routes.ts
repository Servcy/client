// Icons
import {
  AiOutlineApi,
  AiOutlineAreaChart,
  AiOutlineCalendar,
  AiOutlineDollarCircle,
  AiOutlineFileSearch,
  AiOutlineHome,
  AiOutlineInbox,
  AiOutlineProject,
} from "react-icons/ai";
import { IoBusiness } from "react-icons/io5";

export const authRoutes = ["/login"];

export const routes = [
  "/calendar",
  "/projects",
  "/clients",
  "/payments",
  "/documents",
  "/reports",
  "/account",
  "/settings",
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
    name: "Projects",
    href: "/projects",
    icon: AiOutlineProject,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: IoBusiness,
  },
  {
    name: "Inbox",
    href: "/inbox",
    icon: AiOutlineInbox,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: AiOutlineCalendar,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: AiOutlineDollarCircle,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: AiOutlineFileSearch,
  },

  {
    name: "Reports",
    href: "/reports",
    icon: AiOutlineAreaChart,
  },
];
