"use client";

import Sidebar from "@/components/Shared/sidebar";

export default function Index(): JSX.Element {
  return (
    <div className="flex dark:bg-gray-900">
      <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]"></main>
      <div className="order-1">
        <Sidebar />
      </div>
    </div>
  );
}
