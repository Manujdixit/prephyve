"use client";

import { TestInterface } from "@/components/test-interface";
import { sampleTest } from "@/lib/sample-test-data";

export default function Page() {
  const handleTestComplete = (answers: Record<number, number>) => {
    console.log("Test completed with answers:", answers);
    // Here you would typically send the answers to your backend
  };

  return (
    <main className="flex-1">
      <TestInterface
        testId={sampleTest.id}
        testTitle={sampleTest.title}
        questions={sampleTest.questions}
        timeLimit={sampleTest.timeLimit}
        onComplete={handleTestComplete}
      />
    </main>
  );
}
