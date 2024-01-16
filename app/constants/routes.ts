// Icons
import {
  AiOutlineApi,
  AiOutlineAreaChart,
  AiOutlineCalendar,
  AiOutlineDollarCircle,
  AiOutlineFieldTime,
  AiOutlineFileSearch,
  AiOutlineHome,
  AiOutlineInbox,
} from "react-icons/ai";

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
  {
    name: "Calendar",
    href: "/calendar",
    icon: AiOutlineCalendar,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: AiOutlineFileSearch,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: AiOutlineDollarCircle,
  },
  {
    name: "Time Tracking",
    href: "/time-tracking",
    icon: AiOutlineFieldTime,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: AiOutlineAreaChart,
  },
];
