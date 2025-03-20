"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
};

type QuestionStatus = {
  isAnswered: boolean;
  isMarkedForReview: boolean;
};

type TestInterfaceProps = {
  testId: string;
  testTitle: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  onComplete?: (answers: Record<number, number>) => void;
};

export function TestInterface({
  testId,
  testTitle,
  questions,
  timeLimit = 60, // default 60 minutes
  onComplete,
}: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // convert to seconds
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<
    Record<number, boolean>
  >({});
  const [visitedQuestions, setVisitedQuestions] = useState<
    Record<number, boolean>
  >({});

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || isTestCompleted) {
      handleTestComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isTestCompleted]);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => {
      if (optionIndex === -1) {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [questionId]: optionIndex };
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleTestComplete = () => {
    setIsTestCompleted(true);
    if (onComplete) {
      onComplete(answers);
    }
  };

  const toggleReview = () => {
    setShowReview(!showReview);
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => ({
      ...prev,
      [questions[index].id]: true,
    }));
    if (showReview) {
      setShowReview(false);
    }
  };

  const isVisited = (questionId: number) =>
    visitedQuestions[questionId] || false;

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = (questionId: number) => questionId in answers;
  const isMarkedForReview = (questionId: number) =>
    markedForReview[questionId] || false;
  const totalAnswered = Object.keys(answers).length;

  const toggleMarkForReview = (questionId: number) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getQuestionStatus = (questionId: number): QuestionStatus => ({
    isAnswered: isAnswered(questionId),
    isMarkedForReview: isMarkedForReview(questionId),
  });

  // Render test completion screen
  if (isTestCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Test Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Thank you for completing the test!
            </h2>
            <p className="text-muted-foreground">
              You answered {totalAnswered} out of {questions.length} questions.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={toggleReview}>
            Review Answers
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Render main test interface
  return (
    <div className="flex flex-col md:flex-row w-full gap-6 max-w-7xl mx-auto p-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{testTitle}</span>
            <div className="flex items-center gap-2 text-sm font-normal">
              <Clock className="w-4 h-4" />
              <span
                className={cn(
                  timeRemaining < 300 && "text-red-500 font-bold animate-pulse"
                )}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    isAnswered(currentQuestion.id)
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {isAnswered(currentQuestion.id) ? "Answered" : "Unanswered"}
                </span>
              </div>
            </div>
            <div className="text-lg mb-6 font-medium">
              {currentQuestion.question}
            </div>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5",
                    answers[currentQuestion.id] === index
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border"
                  )}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleAnswerSelect(currentQuestion.id, -1)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Reset Response
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={cn(
                "text-sm",
                isMarkedForReview(currentQuestion.id) &&
                  "bg-yellow-100 border-yellow-400 text-yellow-700"
              )}
            >
              {isMarkedForReview(currentQuestion.id)
                ? "Marked for Review"
                : "Mark for Review"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="md:w-[300px] h-fit sticky top-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center text-lg">
            <span>Progress</span>
            <div className="text-sm font-normal">
              {totalAnswered}/{questions.length}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => (
              <Button
                key={q.id}
                variant={isAnswered(q.id) ? "default" : "outline"}
                size="sm"
                onClick={() => navigateToQuestion(index)}
                className={cn(
                  "w-full h-10 transition-all relative",
                  currentQuestionIndex === index &&
                    "ring-2 ring-primary shadow-sm",
                  isAnswered(q.id) &&
                    !isMarkedForReview(q.id) &&
                    "bg-green-100 hover:bg-green-200 text-green-700",
                  !isAnswered(q.id) &&
                    isMarkedForReview(q.id) &&
                    "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-400",
                  isAnswered(q.id) &&
                    isMarkedForReview(q.id) &&
                    "bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-400",
                  isVisited(q.id) &&
                    !isAnswered(q.id) &&
                    !isMarkedForReview(q.id) &&
                    "bg-red-100 hover:bg-red-200 text-red-700 border-red-400"
                )}
              >
                {index + 1}
                {isMarkedForReview(q.id) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-0">
          <Button onClick={handleTestComplete} disabled={isTestCompleted}>
            Submit Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
