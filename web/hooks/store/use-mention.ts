import { useContext } from "react";
// mobx store
import { StoreContext } from "@contexts/StoreContext";

import { IMentionStore } from "@store/mention.store";

export const useMention = (): IMentionStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useMention must be used within StoreProvider");
  return context.mention;
};
