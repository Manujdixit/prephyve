"use client";

import { TestInterface } from "@/components/test-interface";
import { sampleTest } from "@/lib/sample-test-data";
import { useParams } from "next/navigation";

export default function TestPage() {
  const params = useParams();
  const testId = params.id as string;

  // For now, we'll use the sample test data
  // In a real application, we would fetch the test data based on the id
  const test = sampleTest;

  const handleTestComplete = (answers: Record<number, number>) => {
    // In a real application, we would save the test results to a database
    console.log("Test completed", { testId, answers });
    // if (typeof window !== "undefined") {
    //   localStorage.setItem(storageKey, theme);
    // }

    // Redirect to the results page
    window.location.href = `/dashboard/tests/${testId}/results`;
  };

  return (
    <main className="flex-1 container py-8">
      <TestInterface
        testId={test.id}
        testTitle={test.title}
        questions={test.questions}
        timeLimit={test.timeLimit}
        onComplete={handleTestComplete}
      />
    </main>
  );
}
