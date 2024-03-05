import React from "react";
import Image from "next/image";
// images
import ServcyLogo from "public/logo.svg";

export const InstanceNotReady = () => {
  const servcyLogo = ServcyLogo;

  return (
    <div className="h-screen w-full overflow-y-auto bg-onboarding-gradient-100">
      <div className="h-full w-full pt-24">
        <div className="mx-auto h-full rounded-t-md border-x border-t border-custom-border-100 bg-onboarding-gradient-100 px-4 pt-4 shadow-sm sm:w-4/5 md:w-2/3">
          <div className="relative h-full rounded-t-md bg-onboarding-gradient-200 px-7 sm:px-0">
            <div className="flex items-center justify-center py-10">
              <Image src={servcyLogo} className="h-[44px] w-full" alt="Servcy logo" />
            </div>
            <div className="flex w-full flex-col items-center gap-5 py-12 pb-20">
              <h3 className="text-2xl font-medium">Your Servcy instance isn{"'"}t ready yet</h3>
              <p className="text-sm">Ask your Instance Admin to complete set-up first.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
