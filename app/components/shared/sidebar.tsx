"use client";

import { Sidebar } from "flowbite-react";
// Icons
import {
  AiOutlineApi,
  AiOutlineAreaChart,
  AiOutlineCalendar,
  AiOutlineDollarCircle,
  AiOutlineFileSearch,
  AiOutlineInbox,
  AiOutlineProject,
  AiOutlineSetting,
} from "react-icons/ai";
import { IoBusiness } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";

export default function SideBar(): JSX.Element {
  return (
    <div className="fixed top-0 z-10 h-screen overflow-auto lg:sticky lg:!block">
      <Sidebar className="flex h-full w-full flex-col">
        <Sidebar.Logo href="/" img="/logo.svg" imgAlt="Servcy logo">
          <p>Servcy</p>
        </Sidebar.Logo>
        <Sidebar.Items className="mt-10">
          <Sidebar.ItemGroup>
            <Sidebar.Item className="mb-2" href="/inbox" icon={AiOutlineInbox}>
              <p className="text-base">Inbox</p>
            </Sidebar.Item>
            <Sidebar.Item
              className="mb-2"
              href="/calendar"
              icon={AiOutlineCalendar}
            >
              <p className="text-base">Calendar</p>
            </Sidebar.Item>
            <Sidebar.Item
              className="mb-2"
              href="/projects"
              icon={AiOutlineProject}
            >
              <p className="text-base">Projects</p>
            </Sidebar.Item>
            <Sidebar.Item className="mb-2" href="/clients" icon={IoBusiness}>
              <p className="text-base">Clients</p>
            </Sidebar.Item>
            <Sidebar.Item
              className="mb-2"
              href="/payments"
              icon={AiOutlineDollarCircle}
            >
              <p className="text-base">Payments</p>
            </Sidebar.Item>
            <Sidebar.Item
              className="mb-2"
              href="/documents"
              icon={AiOutlineFileSearch}
            >
              <p className="text-base">Documents</p>
            </Sidebar.Item>
            <Sidebar.Item
              className="mb-2"
              href="/reports"
              icon={AiOutlineAreaChart}
            >
              <p className="text-base">Reports</p>
            </Sidebar.Item>
            <Sidebar.Item
              className="mb-2"
              href="/integrations"
              icon={AiOutlineApi}
            >
              <p className="text-base">Integrations</p>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item className="mb-2" href="/account" icon={VscAccount}>
              <p className="text-base">My Account</p>
            </Sidebar.Item>
            <Sidebar.Item
              className="mb-2"
              href="/settings"
              icon={AiOutlineSetting}
            >
              <p className="text-base">Settings</p>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
