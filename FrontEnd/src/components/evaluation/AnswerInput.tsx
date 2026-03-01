"use client";

import { useState } from "react";

type Props = {
  onSubmit?: (answer: string) => void;
};

export default function AnswerInput({ onSubmit }: Props) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim()) return;

    onSubmit?.(answer);
    setAnswer("");
  };

  return (
    <div className="bg-white border rounded-lg p-6">

      <h3 className="font-semibold mb-4">
        Your Answer
      </h3>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full border rounded-md p-3 h-32"
        placeholder="Write your answer here..."
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-md hover:bg-orange-600"
      >
        Submit Answer
      </button>

    </div>
  );
}