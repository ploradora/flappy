"use client";

import { Suspense } from "react";
import { OverviewContent } from "@/components/PagesContent/OverviewContent/OverviewContent";

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading....
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
