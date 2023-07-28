import { FC, PropsWithChildren } from "react";

import AppContext from "@/context/AppContext";
import "@/styles/globals.css";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <AppContext>{children}</AppContext>
      </body>
    </html>
  );
};

export default RootLayout;
