"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";
import { get_useFile_options } from "./server";

const FileContext = createContext("");

export const useFile = () => {
  const id = useContext(FileContext);
  return useSuspenseQuery(get_useFile_options({ id }));
};

export const FileProvider = ({ id, children }: PropsWithChildren & { id: string }) => {
  return <FileContext.Provider value={id}> {children} </FileContext.Provider>;
};
