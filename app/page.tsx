"use client";

// Components
import { Button } from "flowbite-react";
import {
  AiOutlineHome,
  AiOutlineRightCircle,
  AiOutlineRocket,
} from "react-icons/ai";

const activationSteps = [
  {
    title: "Add Your Projects",
    description: "Add your on-going projects or start a new one",
    cta: "Add",
    href: "/projects?tour_step=add-project",
  },
  {
    title: "Integrate Your SaaS Stack",
    description: "Integrate your SaaS stack like GitHub, Slack, Google etc.",
    cta: "Integrate",
    href: "/integrations?tour_step=integrate-saas-stack",
  },
  {
    title: "Associate Your Accounts",
    description:
      "Associate client emails, GitHub repos, Slack channels, Notion pages etc. with your projects",
    cta: "Associate",
    href: "/projects?tour_step=associate-account-with-project",
  },
];

export default function Index(): JSX.Element {
  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-slate-200 p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-white p-6">
        <div className="flex flex-row">
          <AiOutlineHome size="24" className="my-auto mr-2" />
          <p className="text-xl">Dashboard</p>
        </div>
      </header>
      <div className="mb-6 min-h-[80px] rounded-lg bg-white p-6 text-lg">
        <div className="mb-4 flex flex-row">
          <AiOutlineRocket size="24" className="my-auto mr-2" />
          Account Activation Steps
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {activationSteps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 h-20">
                <h5 className="mb-3 font-semibold tracking-tight text-gray-900 dark:text-white">
                  {step.title}
                </h5>
                <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
              <div className="mt-2 flex flex-row justify-between">
                <Button
                  className="w-32"
                  color="gray"
                  outline
                  size="sm"
                  href={step.href}
                >
                  <span className="hover:text-green-500">{step.cta}</span>
                  <AiOutlineRightCircle size="18" className="ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
