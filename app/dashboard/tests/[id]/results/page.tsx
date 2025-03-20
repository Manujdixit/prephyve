"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";

type QuestionResult = {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
};

type TestResult = {
  id: string;
  title: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeSpent: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questions: QuestionResult[];
};

const getTestResult = (id: string): TestResult => {
  const storedAnswers = localStorage.getItem(`test_${id}_answers`);
  const answers = storedAnswers ? JSON.parse(storedAnswers) : {};

  return {
    id,
    title: "Sample Programming Test",
    completedAt: new Date().toISOString(),
    score: 85,
    totalQuestions: 20,
    answeredQuestions: 20,
    timeSpent: 45,
    correctAnswers: 17,
    incorrectAnswers: 3,
    questions: [
      {
        id: "q1",
        question:
          "What is the time complexity of QuickSort in the average case?",
        userAnswer: "O(n log n)",
        correctAnswer: "O(n log n)",
        isCorrect: true,
        explanation:
          "QuickSort has an average time complexity of O(n log n) due to its divide-and-conquer approach.",
      },
      {
        id: "q2",
        question: "What is a closure in JavaScript?",
        userAnswer: "A function that has access to variables in outer scope",
        correctAnswer:
          "A function that has access to variables in its outer (enclosing) lexical scope",
        isCorrect: false,
        explanation:
          "A closure is a function that has access to variables in its outer lexical scope, even after the outer function has returned.",
      },
      ...Array(18)
        .fill(null)
        .map((_, i) => ({
          id: `q${i + 3}`,
          question: `Sample Question ${i + 3}`,
          userAnswer: "Sample Answer",
          correctAnswer: "Correct Answer",
          isCorrect: i % 2 === 0,
          explanation: `Explanation for question ${i + 3}`,
        })),
    ],
  };
};

export default function TestResultPage() {
  const params = useParams();
  const testId = params.id as string;
  const result = getTestResult(testId);

  return (
    <main className="flex-1 container p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Test Results</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{result.title}</span>
            <span className="text-2xl font-bold text-primary">
              {result.score}%
            </span>
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span>
              Completed on {new Date(result.completedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {result.timeSpent} minutes
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-xl font-semibold">{result.score}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall Score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-xl font-semibold">
                    {result.timeSpent} min
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Time Spent</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-xl font-semibold">
                    {result.correctAnswers}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Correct Answers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-xl font-semibold">
                    {result.incorrectAnswers}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Incorrect Answers
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.questions.map((q) => (
              <Card
                key={q.id}
                className={`border-l-4 ${
                  q.isCorrect ? "border-l-green-500" : "border-l-red-500"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{q.question}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Your Answer:</p>
                          <p
                            className={
                              q.isCorrect ? "text-green-600" : "text-red-600"
                            }
                          >
                            {q.userAnswer}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Correct Answer:
                          </p>
                          <p className="text-green-600">{q.correctAnswer}</p>
                        </div>
                      </div>
                      {q.explanation && (
                        <div className="mt-4">
                          <p className="text-muted-foreground">Explanation:</p>
                          <p className="text-sm">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {q.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
