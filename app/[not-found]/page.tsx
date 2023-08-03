"use client";

import Sidebar from "@/components/Shared/sidebar";
import { CiWarning } from "react-icons/ci";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex ">
      <main className="order-2 m-auto p-24">
        <div className="flex flex-col items-center justify-center">
          <CiWarning className="h-32 w-32 text-gray-400" />
          <h1 className="text-4xl font-bold text-gray-400">404</h1>
          <p className="mt-2 text-gray-400">
            Page not found. Please check the URL in the address bar and try
            again.
          </p>
        </div>
      </main>
      <div className="order-1">
        <Sidebar />
      </div>
    </div>
  );
}
