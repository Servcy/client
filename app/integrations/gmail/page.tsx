"use client";

// Components
import Sidebar from "@/components/Shared/sidebar";
import { AiOutlineInbox } from "react-icons/ai";

export default function Gmail(): JSX.Element {
  return (
    <div className="flex">
      <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-slate-200 p-3">
        <header className="mb-6 h-[80px] rounded-lg bg-white p-6">
          <div className="flex flex-row">
            <AiOutlineInbox className="my-auto mr-2" size="20" />
          </div>
        </header>
        <section className="max-xs:grid-cols-1 grid grid-cols-3 gap-3 max-sm:grid-cols-2"></section>
      </main>
      <div className="order-1">
        <Sidebar />
      </div>
    </div>
  );
}
