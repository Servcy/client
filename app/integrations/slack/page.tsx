"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
// Components
import { Spinner } from "flowbite-react";
// Utils
import { getQueryParams } from "@/utils/Shared";
// APIs
import { slackOauth as slackOauthApi } from "@/apis/integration";

export default function SlackOauth(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const params: Record<string, string> = getQueryParams(
      window.location.search
    );
    slackOauthApi(params)
      .then(() => {
        toast.success("Slack connected successfully!");
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        router.push("/integrations");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="h-screen w-full">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner className="m-auto" size="xl" color="success" />
      </div>
    </main>
  );
}
