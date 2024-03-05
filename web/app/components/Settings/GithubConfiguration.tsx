// Components
import { AiFillGithub } from "react-icons/ai";

export default function GithubConfiguration() {
  return (
    <a href="https://github.com/apps/servcy/installations/select_target" target="_blank" rel="noreferrer">
      <button className="servcy-card-bg flex flex-row items-center rounded-lg p-2 text-servcy-black">
        <AiFillGithub className="mr-2" size={20} />
        <span>Install Servcy on Github</span>
      </button>
    </a>
  );
}
