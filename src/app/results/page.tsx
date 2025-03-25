import { Suspense } from "react";
import { ResultsContent } from "@/components/PagesContent/ResultsContent/ResultsContent";

export default function Results() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
