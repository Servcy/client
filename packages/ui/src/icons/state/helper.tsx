export interface IStateGroupIcon {
  className?: string;
  color?: string;
  stateGroup: TStateGroups;
  height?: string;
  width?: string;
}

export type TStateGroups = "backlog" | "unstarted" | "started" | "completed" | "cancelled";

export const STATE_GROUP_COLORS: {
  [key in TStateGroups]: string;
} = {
  backlog: "#d9d9d9",
  unstarted: "#3F76FF",
  started: "#f59e0b",
  completed: "#4d7e3e",
  cancelled: "#dc2626",
};
