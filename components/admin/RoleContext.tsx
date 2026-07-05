"use client";

import { createContext, useContext } from "react";

export type AdminRole = "owner" | "editor" | "viewer" | null;

// Provided by the admin layout (which already fetches /api/admin/me). Lets any
// admin component read the current role to hide/disable write controls. The API
// enforces the same rules server-side — this is UX, not the security boundary.
const RoleContext = createContext<AdminRole>(null);

export const RoleProvider = RoleContext.Provider;

export function useAdminRole(): AdminRole {
  return useContext(RoleContext);
}

/** True when the current admin may write (owner or editor). Viewers = false. */
export function useCanWrite(): boolean {
  const role = useContext(RoleContext);
  return role === "owner" || role === "editor";
}
