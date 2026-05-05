import { atom } from "jotai";

export const isOnlineAtom = atom(
  typeof navigator !== "undefined" ? navigator.onLine : true,
);
