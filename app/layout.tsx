"use client";

import { FC, PropsWithChildren } from "react";

import FlowbiteContext from "@/context/FlowbiteContext";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <FlowbiteContext>
          <Toaster />
          {children}
        </FlowbiteContext>
      </body>
    </html>
  );
};

export default RootLayout;
