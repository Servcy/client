import { getCleanLink } from "@/utils/Shared";
import Avatar from "antd/es/avatar/avatar.js";
import Image from "next/image";

const Cause = ({ cause, source }: { cause: any; source: string }) => {
  if (cause === "None") {
    return null;
  }
  if (["Gmail", "Outlook"].includes(source)) {
    let [name, email] = String(cause).split("<");
    email = String(email).replace(">", "").trim();
    name = String(name).replace(/"/g, "").trim();
    return (
      <div className="min-h-[50px] max-w-[250px] flex-col justify-center text-ellipsis text-left text-sm">
        <div className="flex-row">{name}</div>
        {email !== "undefined" && (
          <div className="flex-row text-gray-400">
            &lt;{email.slice(0, 30)}&gt;
          </div>
        )}
      </div>
    );
  } else if (source === "Github") {
    const { login, avatar_url, html_url } = JSON.parse(cause);
    const cleanImageLink = getCleanLink(avatar_url);
    return (
      <div className="flex min-h-[50px] max-w-[250px] items-center text-ellipsis text-sm">
        <Image
          src={cleanImageLink}
          alt={login}
          className="mr-2 h-5 w-5 rounded-full"
          loader={() => cleanImageLink}
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
    const cleanImageLink = getCleanLink(avatar_url);
    return (
      <div className="flex min-h-[50px] max-w-[250px] items-center text-ellipsis text-sm">
        <Image
          src={cleanImageLink}
          alt={name}
          className="mr-2 h-5 w-5 rounded-full"
          loader={() => cleanImageLink}
          width={20}
          height={20}
        />
        <div>{name}</div>
      </div>
    );
  } else if (source === "Slack") {
    const { real_name, image_32 } = JSON.parse(cause);
    const cleanImageLink = getCleanLink(image_32);
    return (
      <div className="flex min-h-[50px] max-w-[250px] items-center text-ellipsis text-sm">
        <Image
          src={cleanImageLink}
          alt={real_name}
          className="mr-2 h-5 w-5 rounded-full"
          width={20}
          loader={() => cleanImageLink}
          height={20}
        />
        <div>{real_name}</div>
      </div>
    );
  } else if (source === "Asana") {
    const { name, photo } = JSON.parse(cause);
    const cleanImageLink = getCleanLink(
      photo.image_60x60 ?? photo.image_128x128 ?? photo.image_21x21 ?? ""
    );
    return (
      <div className="flex min-h-[50px] max-w-[250px] items-center text-ellipsis text-sm">
        {cleanImageLink && (
          <Image
            src={cleanImageLink}
            alt={name}
            className="mr-2 h-5 w-5 rounded-full"
            width={20}
            loader={() => cleanImageLink}
            height={20}
          />
        )}
        <div>{name}</div>
      </div>
    );
  } else if (source === "Trello") {
    const { fullName, initials } = JSON.parse(cause);
    return (
      <div className="flex min-h-[50px] max-w-[250px] items-center text-ellipsis text-sm">
        <Avatar className="mr-2 rounded-full" size="small">
          {initials}
        </Avatar>
        <div>{fullName}</div>
      </div>
    );
  }
  return (
    <span className="max-w-[250px] text-ellipsis text-center">{cause}</span>
  );
};

export default Cause;
