"use client";

// Dependencies
import { useRouter } from "next/navigation.js";
import { useState } from "react";
// Components
import AddClient from "@/components/Activation/addClient";
import AddProject from "@/components/Activation/addProject";
import { Button } from "antd";
import {
  AiOutlineHome,
  AiOutlineRightCircle,
  AiOutlineRocket,
} from "react-icons/ai";

const activationSteps = [
  {
    uid: "add-clients",
    title: "Add Your Clients",
    description: "Add client details like name, address, email, phone etc.",
    cta: "Add",
  },
  // {
  //   uid: "add-projects",
  //   title: "Add Your Projects",
  //   description: "Add your on-going projects or start a new one",
  //   cta: "Add",
  // },
  {
    title: "Integrate Your Apps",
    description:
      "Integrate workspaces like GitHub, Slack, Google, Notion, Figma, Linear, Jira, Trello etc.",
    cta: "Integrate",
    href: "/integrations",
  },
];

export default function Index(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>();
  const [selectedActivationStep, setSelectedActivationStep] =
    useState<string>("");
  const router = useRouter();

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
        <div className="grid gap-8 lg:grid-cols-3">
          {activationSteps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border bg-servcy-black p-4 text-servcy-white shadow-sm"
            >
              <div className="mb-4 h-24">
                <h5 className="mb-3 font-semibold tracking-tight text-servcy-wheat">
                  {step.title}
                </h5>
                <p className="text-sm font-normal">{step.description}</p>
              </div>
              <div className="mt-2 flex flex-row justify-between">
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    step.uid
                      ? setSelectedActivationStep(step.uid)
                      : step.href
                      ? router.push(step.href)
                      : undefined;
                  }}
                  icon={<AiOutlineRightCircle />}
                  className="text-servcy-white hover:!border-servcy-wheat hover:!text-servcy-wheat"
                >
                  {step.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedActivationStep === "add-clients" && (
        <AddClient isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
      {isModalOpen && selectedActivationStep === "add-projects" && (
        <AddProject isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </main>
  );
}
