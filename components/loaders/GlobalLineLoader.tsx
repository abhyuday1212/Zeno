"use client";

import { useAppSelector } from "@/lib/store/hooks";

export default function GlobalLineLoader() {
  const isLoading = useAppSelector((state) => state.globalLineLoader.isLoading);

  if (!isLoading) return null;

  return (
    <div className="w-full">
      <div className="globallineloader">
        <div className="light"></div>
      </div>
    </div>
  );
}
