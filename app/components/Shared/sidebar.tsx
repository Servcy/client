"use client";

// Components
import Image from "next/image.js";
// Constants
import { sidebarOptions } from "@/constants/routes";
// Icons
import { AiOutlineSetting } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
// Utils
import cn from "classnames";
import { useState } from "react";

export default function SideBar(): JSX.Element {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div
      className="fixed top-0 z-10 h-screen overflow-auto lg:sticky lg:!block"
      onMouseOver={() => {
        !isSidebarHovered && setIsSidebarHovered(true);
      }}
      onMouseLeave={() => {
        isSidebarHovered && setIsSidebarHovered(false);
      }}
      onFocus={() => {
        !isSidebarHovered && setIsSidebarHovered(true);
      }}
    >
      <nav aria-label="Sidebar" className="flex h-full w-full flex-col">
        <div className="h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 py-4 px-3 dark:bg-gray-800">
          <a
            aria-labelledby="flowbite-sidebar-logo-:Rqkq:"
            href="/"
            className="mb-5 flex items-center rounded-lg bg-gray-200 py-4 pl-2.5"
          >
            <Image
              alt="Servcy logo"
              width={28}
              height={28}
              src="/logo.svg"
              className="mr-3 h-6 sm:h-7"
            />
            {isSidebarHovered && (
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                <p className="text-xl">Servcy</p>
              </span>
            )}
          </a>
          <div className="mt-6">
            <ul className="list-none border-t border-gray-200 pt-3 first:mt-0 first:border-t-0 first:pt-0">
              {sidebarOptions.map((option, index) => (
                <li key={index}>
                  <a
                    className={cn(
                      "mb-2 flex items-center rounded-lg p-2 text-lg font-normal text-gray-900 no-underline hover:bg-gray-100",
                      {
                        "justify-center": !isSidebarHovered,
                      }
                    )}
                    href={option.href}
                  >
                    <option.icon size="24" />
                    <span
                      id="flowbite-sidebar-item-:R5akq:"
                      className={cn("flex-1 whitespace-nowrap px-3", {
                        hidden: !isSidebarHovered,
                      })}
                    >
                      <p className="text-base">{option.name}</p>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="fixed bottom-0 list-none border-t border-gray-200 pt-3 first:mt-0 first:border-t-0 first:pt-0 last:mb-3">
              <li>
                <a
                  className={cn(
                    "mb-2 flex items-center rounded-lg p-2 text-lg font-normal text-gray-900 no-underline hover:bg-gray-100",
                    {
                      "justify-center": !isSidebarHovered,
                    }
                  )}
                  href="/settings"
                >
                  <AiOutlineSetting size="24" />
                  <span
                    id="flowbite-sidebar-item-:R5akq:"
                    className={cn("flex-1 whitespace-nowrap px-3", {
                      hidden: !isSidebarHovered,
                    })}
                  >
                    <p className="text-base">Settings</p>
                  </span>
                </a>
              </li>
              <li>
                <a
                  className={cn(
                    "mb-2 flex items-center rounded-lg p-2 text-lg font-normal text-gray-900 no-underline hover:bg-gray-100",
                    {
                      "justify-center": !isSidebarHovered,
                    }
                  )}
                  href="/settings"
                >
                  <VscAccount size="24" />
                  <span
                    id="flowbite-sidebar-item-:R5akq:"
                    className={cn("flex-1 whitespace-nowrap px-3", {
                      hidden: !isSidebarHovered,
                    })}
                  >
                    <p className="text-base">My Account</p>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
