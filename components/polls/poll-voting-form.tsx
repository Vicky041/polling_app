"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitVote } from "@/lib/actions";

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollVotingFormProps = {
  pollId: string;
  options: PollOption[];
  total_votes: number;
};

export default function PollVotingForm({
  pollId,
  options,
  total_votes,
}: PollVotingFormProps) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleVote = async (formData: FormData) => {
    const optionId = formData.get("optionId") as string;
    if (!optionId) return;

    await submitVote(pollId, optionId);
    setVoted(true);
    setSuccessMessage("Thank you for voting!");
  };

  if (voted) {
    return (
      <div>
        {successMessage && <p className="text-green-600">{successMessage}</p>}
        <h3 className="font-medium mb-4">Results:</h3>
        {options.map((option) => {
          const percentage =
            total_votes > 0
              ? Math.round(
                  ((option.votes + (option.id === selectedOption ? 1 : 0)) /
                    (total_votes + 1)) *
                    100,
                )
              : 0;
          return (
            <div key={option.id} className="space-y-2 mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{option.text}</span>
                <span className="text-sm text-gray-600">
                  {option.votes + (option.id === selectedOption ? 1 : 0)} votes
                  ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <form action={handleVote}>
      <input type="hidden" name="pollId" value={pollId} />
      <div className="space-y-4">
        <h3 className="font-medium mb-4">Choose your option:</h3>
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name="optionId"
              value={option.id}
              className="w-4 h-4"
              required
              onChange={() => setSelectedOption(option.id)}
            />
            <div className="flex-1">
              <span className="font-medium">{option.text}</span>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-6">
        <Button type="submit" className="w-full">
          Submit Vote
        </Button>
      </div>
    </form>
  );
}
