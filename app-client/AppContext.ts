import { createContext } from "react";

export const RoomCode = createContext("");
export const Guest = createContext("");
export const User = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>(["", () => {}]);
