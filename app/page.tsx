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
    title: "Add Your Clients",
    description: "Add client details like name, address, email, phone etc.",
    cta: "Add",
    href: "/clients?tour_step=add-client",
  },
  {
    title: "Add Your Projects",
    description: "Add your on-going projects or start a new one",
    cta: "Add",
    href: "/projects?tour_step=add-project",
  },
  {
    title: "Integrate Your Apps",
    description:
      "Integrate workspaces like GitHub, Slack, Google, Notion, Figma, Linear, Jira, Trello etc.",
    cta: "Integrate",
    href: "/integrations?tour_step=integrate-saas-stack",
  },
  {
    title: "Invite Your Team",
    description:
      "Invite your team members, and assign them to projects with roles",
    cta: "Invite",
    href: "/team?tour_step=invite-team",
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
          Start Your Journey
        </div>
        <div className="grid gap-8 lg:grid-cols-4">
          {activationSteps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border bg-servcy-black p-4 text-servcy-white shadow-sm"
            >
              <div className="mb-4 h-24">
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
