// Staff-only "view as a member" preview toggle. Staff accounts see Draft
// situations by default (STAFF PREVIEW); this lets them flip to exactly what a
// real member sees (Published only) without changing any publication state.
// Client-only (localStorage); the server still enforces the draft filter — the
// toggle just adds `?as=user` so staff opt into the member view.

export const VIEW_AS_USER_KEY = "companion_view_as_user";

export function getViewAsUser(): boolean {
  try { return typeof window !== "undefined" && window.localStorage.getItem(VIEW_AS_USER_KEY) === "1"; }
  catch { return false; }
}

export function setViewAsUser(on: boolean): void {
  try { window.localStorage.setItem(VIEW_AS_USER_KEY, on ? "1" : "0"); } catch { /* ignore */ }
}

/** Query suffix to append to situation fetches when viewing as a member. */
export function asUserParam(on: boolean): string {
  return on ? "&as=user" : "";
}
