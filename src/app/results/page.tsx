'use client';

import { Suspense } from "react";
import { ResultsContent } from "@/components/PagesContent/ResultsContent/ResultsContent";
import { LoaderCircle } from "lucide-react";

export default function Results() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
           <LoaderCircle className="animate-spin text-gray-100" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
