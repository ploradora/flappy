"use client";

import { OverviewContent } from "@/components/PagesContent/OverviewContent/OverviewContent";
import { Suspense } from "react";

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
