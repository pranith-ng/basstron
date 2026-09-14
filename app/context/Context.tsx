"use client";

import { createContext, useContext, useState } from "react";

type ContextType = {
  loaderLoaded: boolean;
  viewerLoaded: boolean;
  heroLoaded: boolean;

  setLoaderLoaded: (value: boolean) => void;
  setViewerLoaded: (value: boolean) => void;
  setHeroLoaded: (value: boolean) => void;
};

const Context = createContext<ContextType | null>(null);

export function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaderLoaded, setLoaderLoaded] = useState(false);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <Context.Provider
      value={{
        loaderLoaded,
        viewerLoaded,
        setLoaderLoaded,
        setViewerLoaded,
        heroLoaded, 
        setHeroLoaded,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAppContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside ContextProvider"
    );
  }

  return context;
}