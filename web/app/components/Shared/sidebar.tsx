import Image from "next/image.js";

import { sidebarOptions } from "@/constants/routes";

import { AiOutlinePoweroff, AiOutlineSetting } from "react-icons/ai";

import cn from "classnames";
import { useState } from "react";

export default function SideBar({ logout }: { logout: () => Promise<void> }): JSX.Element {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div
      className="!sticky top-0 z-10 !block h-screen overflow-auto bg-servcy-black"
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
        <div className="h-full overflow-y-auto overflow-x-hidden rounded px-3 py-4">
          <a href="/" className="mb-5 flex items-center rounded-lg bg-servcy-gray py-4 pl-2.5">
            <Image alt="Servcy logo" width={28} height={28} src="/logo.svg" className="mr-3 h-6 sm:h-7" />
            {isSidebarHovered && (
              <span className="self-center whitespace-nowrap text-xl font-semibold">
                <p className="text-xl">Servcy</p>
              </span>
            )}
          </a>
          <div className="mt-6">
            <ul className="list-none border-t border-servcy-gray pt-3 first:mt-0 first:border-t-0 first:pt-0">
              {sidebarOptions.map((option, index) => (
                <li key={index}>
                  <a
                    className={cn(
                      "mb-2 flex items-center rounded-lg p-2 text-lg font-normal no-underline hover:bg-servcy-white text-servcy-white hover:text-servcy-black",
                      {
                        "justify-center": !isSidebarHovered,
                      }
                    )}
                    href={option.href}
                  >
                    <option.icon size="24" />
                    <span
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
            <ul className="fixed bottom-0 list-none border-t border-servcy-gray pt-3 first:mt-0 first:border-t-0 first:pt-0 last:mb-3">
              <li>
                <a
                  className={cn(
                    "mb-2 flex items-center rounded-lg p-2 text-lg font-normal no-underline hover:bg-servcy-white text-servcy-white hover:text-servcy-black",
                    {
                      "justify-center": !isSidebarHovered,
                    }
                  )}
                  href="/settings"
                >
                  <AiOutlineSetting size="24" />
                  <span
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
                    "mb-2 flex items-center rounded-lg p-2 text-lg font-normal no-underline hover:bg-servcy-white text-servcy-white hover:text-servcy-black",
                    {
                      "justify-center": !isSidebarHovered,
                    }
                  )}
                  href="#logging-out"
                  onClick={() => {
                    logout();
                  }}
                >
                  <AiOutlinePoweroff size="24" />
                  <span
                    className={cn("flex-1 whitespace-nowrap px-3", {
                      hidden: !isSidebarHovered,
                    })}
                  >
                    <p className="text-base">Logout</p>
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
