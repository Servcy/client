"use client";

import Image from "next/image";

const Cause = ({ cause, source }: { cause: any; source: string }) => {
  if (["Gmail", "Outlook"].includes(source)) {
    console.log(cause);
    let [name, email] = String(cause).split("<");
    email = String(email).replace(">", "").trim();
    name = String(name).replace(/"/g, "").trim();
    return (
      <div className="min-h-[50px] flex-col text-sm">
        <div className="flex-row">{name}</div>
        {email !== "undefined" && (
          <div className="flex-row text-gray-400">&lt;{email}&gt;</div>
        )}
      </div>
    );
  } else if (source === "Github") {
    const { login, avatar_url, html_url } = JSON.parse(cause);
    return (
      <div className="flex min-h-[50px] items-center justify-center text-sm">
        <Image
          src={avatar_url}
          alt={login}
          className="mr-2 h-5 w-5 rounded-full"
          width={20}
          height={20}
        />
        <a
          href={html_url}
          target="_blank"
          rel="noreferrer"
          className="text-white"
        >
          {login}
        </a>
      </div>
    );
  } else if (source === "Notion") {
    const { name, avatar_url } = JSON.parse(cause);
    return (
      <div className="flex min-h-[50px] items-center justify-center text-sm">
        <Image
          src={avatar_url}
          alt={name}
          className="mr-2 h-5 w-5 rounded-full"
          width={20}
          height={20}
        />
        <div>{name}</div>
      </div>
    );
  } else if (source === "Slack") {
    const { real_name, image_32 } = JSON.parse(cause);
    return (
      <div className="flex min-h-[50px] items-center justify-center text-sm">
        <Image
          src={image_32}
          alt={real_name}
          className="mr-2 h-5 w-5 rounded-full"
          width={20}
          height={20}
        />
        <div>{real_name}</div>
      </div>
    );
  }
  return <span>{cause}</span>;
};

export default Cause;
