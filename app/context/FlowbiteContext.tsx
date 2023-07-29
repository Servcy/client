"use client";

import { flowbiteTheme as theme } from "@/utils/Flowbite/theme";
import { Flowbite } from "flowbite-react";
import { FC, PropsWithChildren } from "react";

const FlowbiteContext: FC<PropsWithChildren> = function ({ children }) {
  return <Flowbite theme={{ theme }}>{children}</Flowbite>;
};

export default FlowbiteContext;
