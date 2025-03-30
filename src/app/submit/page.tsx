'use client';

import { Suspense } from "react";
import { SubmitContent } from "@/components/PagesContent/SubmitContent/SubmitContent";
import { LoaderCircle } from "lucide-react";

export default function Submit() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoaderCircle className="animate-spin text-gray-100" />
        </div>
      }
    >
      <SubmitContent />
    </Suspense>
  );
}
