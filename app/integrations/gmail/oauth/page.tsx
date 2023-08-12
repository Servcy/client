"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
// Components
import { Spinner } from "flowbite-react";
// Utils
import { getQueryParams } from "@/utils/Shared";
// APIs
import { googleOauth as googleOauthApi } from "@/apis/integration";

export default function GoogleOauth(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const params: Record<string, string> = getQueryParams(
      window.location.search
    );
    googleOauthApi(params["code"] ?? "", params["scope"] ?? "")
      .then(() => {
        toast.success("Gmail connected successfully!");
        router.push("/integrations/gmail");
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
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
