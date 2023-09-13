"use client";

import { useEffect } from "react";
// Components
import { Spinner } from "flowbite-react";

export default function GithubInstall(): JSX.Element {
  useEffect(() => {
    window.open("https://github.com/apps/servcy/installations/select_target");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="h-screen w-full">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner className="m-auto" size="xl" color="success" />
      </div>
    </main>
  );
}
