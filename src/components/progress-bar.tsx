"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ProgressBar = dynamic(
  () => import("next-nprogress-bar").then((mod) => mod.AppProgressBar),
  { ssr: false },
);

export function ProgressProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <>
      <ProgressBar
        height="4px"
        color="#00BCD4"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  );
}