// Components
import { AiFillGithub } from "react-icons/ai";

export default function GithubConfiguration() {
  return (
    <a
      href="https://github.com/apps/servcy/installations/select_target"
      target="_blank"
      rel="noreferrer"
    >
      <button className="flex flex-row rounded-lg bg-servcy-black p-2 text-servcy-wheat">
        <AiFillGithub className="my-auto mr-2" size={20} />
        Install Servcy on Github
      </button>
    </a>
  );
}
