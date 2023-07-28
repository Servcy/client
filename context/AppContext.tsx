"use client";

import { Flowbite } from "flowbite-react";
import { FC, PropsWithChildren } from "react";
import { flowbiteTheme as theme } from "../app/theme";

const AppContext: FC<PropsWithChildren> = function ({ children }) {
  return <Flowbite theme={{ theme }}>{children}</Flowbite>;
};

export default AppContext;
