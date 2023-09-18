"use client";

// Components
import { AiOutlineHome, AiOutlineRocket } from "react-icons/ai";

export default function Index(): JSX.Element {
  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-slate-200 p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-white p-6">
        <div className="flex flex-row">
          <AiOutlineHome size="24" className="my-auto mr-2" />
          <p className="text-xl">Dashboard</p>
        </div>
      </header>
      <div className="mb-6 h-[80px] rounded-lg bg-white p-6">
        <div className="flex flex-row">
          <AiOutlineRocket size="24" className="my-auto mr-2" />
          <p className="text-lg">Account Activation Steps</p>
        </div>
      </div>
    </main>
  );
}
