"use client";

import { OverviewContent } from "@/components/PagesContent/OverviewContent/OverviewContent";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoaderCircle className="animate-spin text-gray-100" />
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
