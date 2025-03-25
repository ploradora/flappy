import { Suspense } from "react";
import { SubmitContent } from "@/components/PagesContent/SubmitContent/SubmitContent";

export default function Submit() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SubmitContent />
    </Suspense>
  );
}
