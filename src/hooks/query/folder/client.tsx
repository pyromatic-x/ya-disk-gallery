"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";
import { get_useFolder_options } from "./server";

const Context = createContext("");

export const useFolder = () => {
  const id = useContext(Context);
  return useSuspenseQuery(get_useFolder_options({ id }));
};

export const FolderProvider = ({ id, children }: PropsWithChildren & { id: string }) => {
  return <Context.Provider value={id}> {children} </Context.Provider>;
};
