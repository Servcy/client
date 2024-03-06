"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";

import Blocked from "@/components/Shared/blocked";
import { SyncOutlined } from "@ant-design/icons";
import { Analytics } from "@vercel/analytics/react";
import { Spin } from "antd";
import { Toaster } from "react-hot-toast";
// Context
import { GoogleOAuthProvider } from "@react-oauth/google";
// Styles
import "@/styles/globals.css";

import { isMobileDevice } from "@/utils/Shared";

const LoginLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <GoogleOAuthProvider clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}>
          <ContentWithSidebar>
            {children}
            <Analytics />
          </ContentWithSidebar>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

const ContentWithSidebar: FC<PropsWithChildren> = function ({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading)
    return (
      <div className="flex h-screen justify-center">
        <Spin
          className="order-2 m-auto"
          size="large"
          indicator={
            <SyncOutlined
              spin
              style={{
                color: "#26542F",
              }}
            />
          }
        />
      </div>
    );
  if (isMobileDevice(navigator.userAgent))
    return (
      <div className="flex h-screen justify-center">
        <Blocked />
      </div>
    );
  return <div className="flex">{children}</div>;
};

export default LoginLayout;
