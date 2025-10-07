"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

/**
 * PUBLIC_INTERFACE
 * Interactive panel offering Quiz and Flashcards placeholders.
 */
export default function InteractivePanel() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [flashOpen, setFlashOpen] = useState(false);

  return (
    <div className="mt-4 p-4 rounded-md bg-gradient-to-r from-blue-50 to-gray-50 border">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="font-semibold text-gray-900">Deepen your learning</h4>
          <p className="text-sm text-gray-600">Try a quick quiz or review flashcards based on this session.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setQuizOpen(true)}>Start Quiz</Button>
          <Button variant="secondary" onClick={() => setFlashOpen(true)}>
            View Flashcards
          </Button>
        </div>
      </div>

      <Modal open={quizOpen} onClose={() => setQuizOpen(false)} title="Quick Quiz">
        <p className="text-sm text-gray-700">
          Placeholder quiz UI. TODO: Integrate with backend /interact/quiz/start and /interact/quiz/submit.
        </p>
        <div className="mt-3 space-y-2">
          <div>
            <p className="font-medium">Q1. Which concept best applies?</p>
            <label className="flex items-center gap-2 text-sm mt-1">
              <input type="radio" name="q1" /> Option A
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="q1" /> Option B
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="q1" /> Option C
            </label>
          </div>
          <Button className="mt-2">Submit</Button>
        </div>
      </Modal>

      <Modal open={flashOpen} onClose={() => setFlashOpen(false)} title="Flashcards">
        <div className="space-y-3">
          <div className="p-4 rounded-md border">
            <p className="text-sm text-gray-700">Term: Principle X</p>
            <p className="text-xs text-gray-500">Flip to see explanation.</p>
          </div>
          <div className="p-4 rounded-md border bg-gray-50">
            <p className="text-sm text-gray-700">Explanation: This principle states...</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
