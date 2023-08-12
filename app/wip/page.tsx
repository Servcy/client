"use client";

import Sidebar from "@/components/Shared/sidebar";
import { TbBarrierBlock } from "react-icons/tb";

export default function WIP(): JSX.Element {
  return (
    <div className="flex ">
      <main className="order-2 m-auto p-24">
        <div className="flex flex-col items-center justify-center">
          <TbBarrierBlock className="h-32 w-32 text-gray-400" />
          <p className="mt-2 text-gray-400">
            Oops... this is still a work in progress. Please check back later.
          </p>
        </div>
      </main>
      <div className="order-1">
        <Sidebar />
      </div>
    </div>
  );
}
