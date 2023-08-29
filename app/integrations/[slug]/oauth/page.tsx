"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
// Components
import { Spinner } from "flowbite-react";
// Utils
import { getQueryParams } from "@/utils/Shared";
// APIs
import { integrationOauth as integrationOauthApi } from "@/apis/integration";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function IntegrationOauth(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  useEffect(() => {
    if (typeof slug !== "string") return;
    const oauthParams: Record<string, string> = getQueryParams(
      window.location.search
    );
    integrationOauthApi(oauthParams, slug)
      .then((response) => {
        toast.success(`${capitalizeFirstLetter(slug)} connected successfully!`);
        if (response?.results !== "null")
          router.push(response?.results?.redirect || "/integrations");
        else router.push("/integrations");
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.detail || "Something went wrong!");
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
