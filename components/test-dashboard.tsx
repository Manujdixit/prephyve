"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";

type TestHistoryItem = {
  id: string;
  title: string;
  completedAt: string;
  score?: number;
  totalQuestions: number;
  answeredQuestions: number;
};

const sampleTestHistory: TestHistoryItem[] = [
  {
    id: "test-123",
    title: "Sample Programming Test",
    completedAt: "2024-02-10T15:30:00Z",
    score: 85,
    totalQuestions: 20,
    answeredQuestions: 20,
  },
  {
    id: "test-124",
    title: "JavaScript Fundamentals",
    completedAt: "2024-02-08T10:15:00Z",
    score: 92,
    totalQuestions: 15,
    answeredQuestions: 15,
  },
];

export function TestDashboard() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Available Tests</h2>
          <Button asChild>
            <Link href="/dashboard/tests/new">
              <Plus className="w-4 h-4 mr-2" />
              Start New Test
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Programming Test</CardTitle>
              <CardDescription>Test your programming knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                <span>30 minutes</span>
              </div>
              <Button className="w-full" asChild>
                <Link href="/dashboard/tests/test-123">Start Test</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Test History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTestHistory.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>
                  Completed on {new Date(test.completedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Score</span>
                    <Link
                      href={`/dashboard/tests/${test.id}/results`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {test.score}%
                    </Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">
                      {test.answeredQuestions}/{test.totalQuestions}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
