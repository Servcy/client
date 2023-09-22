"use client";

// Components
import { Button } from "antd";
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
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
        <div className="flex flex-row">
          <AiOutlineHome size="24" className="my-auto mr-2" />
          <p className="text-xl">Dashboard</p>
        </div>
      </header>
      <div className="mb-6 min-h-[80px] rounded-lg bg-servcy-white p-6 text-lg">
        <div className="mb-4 flex flex-row">
          <AiOutlineRocket size="24" className="my-auto mr-2" />
          Account Activation Steps
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {activationSteps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border  bg-servcy-black p-4 text-servcy-white shadow-sm"
            >
              <div className="mb-4 h-20">
                <h5 className="mb-3 font-semibold tracking-tight">
                  {step.title}
                </h5>
                <p className="text-sm font-normal">{step.description}</p>
              </div>
              <div className="mt-2 flex flex-row justify-between">
                <Button
                  href={step.href}
                  icon={<AiOutlineRightCircle />}
                  className="hover:!border-servcy-light hover:!text-servcy-light"
                >
                  {step.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
