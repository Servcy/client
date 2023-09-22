"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
// Components
import { SyncOutlined } from "@ant-design/icons";
import { Spin } from "antd";
// Utils
import { getQueryParams } from "@/utils/Shared";
// APIs
import { integrationOauth as integrationOauthApi } from "@/apis/integration";
// Context
import { useSidebarContext } from "@/context/SidebarContext";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function IntegrationOauth(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const { setIsPageWithSidebar } = useSidebarContext();

  useEffect(() => {
    setIsPageWithSidebar(false);
    if (typeof slug !== "string") return;
    const oauthParams: Record<string, string> = getQueryParams(
      window.location.search
    );
    integrationOauthApi(oauthParams, slug)
      .then((response) => {
        toast.success(`${capitalizeFirstLetter(slug)} connected successfully!`);
        if (response?.results !== "null") {
          const redirect_uri =
            JSON.parse(response?.results)?.redirect_uri || "/integrations";
          if (redirect_uri.startsWith("https")) {
            window.open("/integrations", "_blank");
            setTimeout(() => {
              router.push(redirect_uri);
            }, 1000);
          } else router.push(redirect_uri);
        } else router.push("/integrations");
        setIsPageWithSidebar(true);
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.detail || "Something went wrong!");
        router.push("/integrations");
        setIsPageWithSidebar(true);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="h-screen w-full bg-servcy-white">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spin
          className="m-auto"
          size="large"
          indicator={
            <SyncOutlined
              rev
              spin
              style={{
                color: "#26542F",
              }}
            />
          }
        />
      </div>
    </main>
  );
}
