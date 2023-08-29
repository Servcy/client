"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Utils
import { getQueryParams } from "@/utils/Shared";
// Components
import { Button, Label, TextInput } from "flowbite-react";
import Image from "next/image.js";
import { MdOutlineSyncAlt } from "react-icons/md";
// APIs
import { configureFigma as configureFigmaApi } from "@/apis/integration";

export default function FigmaSetup(): JSX.Element {
  const [query, setQueryParams] = useState<Record<string, string>>({});
  const router = useRouter();
  const [teamIds, setTeamIds] = useState<string[]>([""]);

  useEffect(() => {
    setQueryParams(getQueryParams(window.location.search));
    console.log(getQueryParams(window.location.search));
  }, []);

  const addTeamId = () => {
    if (teamIds.length > 2) {
      toast.error("You can add a maximum of 3 team IDs");
      return;
    }
    setTeamIds([...teamIds, ""]);
  };

  const configureFigma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    configureFigmaApi({
      teamIds,
      userIntegrationId: query["user_integration_id"],
    })
      .then(() => {
        toast.success("Figma configured successfully!");
        router.push("/integrations");
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.detail || "Something went wrong!");
        router.push("/integrations");
      });
  };

  return (
    <main className="h-screen w-full bg-slate-200">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex min-h-[500px] w-[80%] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md md:flex-row">
          <div className="w-full flex-col p-4">
            <div className="flex text-xl font-semibold">
              <Image
                className="my-auto h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] rounded-lg border border-gray-300 p-1"
                src="https://servcy-public.s3.amazonaws.com/figma.svg"
                width={40}
                height={40}
                alt="Figma Logo"
              />
              <MdOutlineSyncAlt
                className="my-auto mx-2"
                color="grey"
                size={20}
              />
              <Image
                className="my-auto mr-5 max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] rounded-lg border border-gray-300 p-1"
                src="https://servcy-public.s3.amazonaws.com/logo.svg"
                width={40}
                height={40}
                alt="Servcy Logo"
              />
              <div className="my-auto">Figma Integration Setup</div>
            </div>
            <section className="mt-8">
              <span className="font-sans text-lg font-semibold">
                To find your team IDs follow listed instructions:
              </span>
              <ul className="mt-4 list-inside font-serif text-sm font-light">
                <li className="mb-4">
                  Login to your figma account in a separate tab
                </li>
                <li className="mb-4">
                  Under teams dropdown in your sidebar, you will find all your
                  teams
                </li>
                <li className="mb-4">
                  Click on the team you want to integrate with Servcy
                </li>
                <li className="mb-4">
                  Copy the team id from the URL in your browser
                </li>
                <li>
                  For example if the URL is{" "}
                  <span className="rounded-lg bg-slate-200 p-1 font-semibold">
                    https://www.figma.com/files/team/123/Servcy
                  </span>{" "}
                  then the team id is{" "}
                  <span className="rounded-lg bg-slate-200 p-1 font-semibold">
                    123
                  </span>
                </li>
              </ul>
            </section>
          </div>
          <div className="w-full flex-col p-4">
            <form className="flex flex-col gap-4" onSubmit={configureFigma}>
              <div>
                {teamIds.map((teamId, index) => (
                  <div key={index} className="py-2">
                    <Label>Team ID</Label>
                    <TextInput
                      value={teamId}
                      placeholder="Enter team ID"
                      onChange={(e) => {
                        const newTeamIds = [...teamIds];
                        newTeamIds[index] = e.target.value;
                        setTeamIds(newTeamIds);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  color="cyan"
                  outline
                  onClick={() => addTeamId()}
                >
                  + Add More
                </Button>
              </div>
              <Button color="success" type="submit">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
