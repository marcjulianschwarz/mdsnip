import React from "react";
import { UserContext } from "@/contexts/UserContext";

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) throw new Error("need userProvider to use useUser");
  return context;
}
