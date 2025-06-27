import React from "react";
import { BsEmojiDizzy, BsEmojiNeutral, BsEmojiSmile } from "react-icons/bs";
import useClaimVoteByUser from "@/app/_hooks/useClaimVoteByUser";
import useSubmitVote from "@/app/_hooks/useSubmitVote";
import { cn } from "@/lib/utils";

const VotingSection = ({ claimId }: { claimId: string }) => {
  const { vote, loading, refetch } = useClaimVoteByUser(claimId);
  const { submitVote, submitting } = useSubmitVote();

  console.log(
    "VotingSection render - vote:",
    vote,
    "loading:",
    loading,
    "submitting:",
    submitting
  );

  const handleVote = async (voteValue: number) => {
    console.log("Submitting vote:", voteValue, "Current vote:", vote);
    const success = await submitVote(claimId, voteValue, vote, () => {
      // Trigger a refetch after successful vote submission
      console.log("Vote submitted successfully, triggering refetch");
      setTimeout(() => {
        if (refetch) {
          refetch();
        }
      }, 100);
    });
    console.log("Vote submission result:", success);
  };

  const isDisabled = loading;

  return (
    <div className="flex items-center gap-1 mt-1">
      <button
        className={cn(
          "flex flex-col cursor-pointer items-center flex-1 bg-red-500/10 text-red-700 py-1 rounded-md gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
          vote === -1 ? "bg-red-500 text-white" : "hover:bg-red-500/20"
        )}
        disabled={isDisabled}
        onClick={() => handleVote(-1)}
      >
        {submitting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
        ) : (
          <>
            <BsEmojiDizzy className="size-4 opacity-70" />
            Don&apos;t agree
          </>
        )}
      </button>
      <button
        className={cn(
          "flex flex-col cursor-pointer items-center flex-1 bg-yellow-500/10 text-yellow-700 py-1 rounded-md gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
          vote === 0 ? "bg-yellow-600 text-white" : "hover:bg-yellow-500/20"
        )}
        disabled={isDisabled}
        onClick={() => handleVote(0)}
      >
        {submitting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700"></div>
        ) : (
          <>
            <BsEmojiNeutral className="size-4 opacity-70" />
            Not sure
          </>
        )}
      </button>
      <button
        className={cn(
          "flex flex-col cursor-pointer items-center flex-1 bg-green-500/10 text-green-700 py-1 rounded-md gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
          vote === 1 ? "bg-green-500 text-white" : "hover:bg-green-500/20"
        )}
        disabled={isDisabled}
        onClick={() => handleVote(1)}
      >
        {submitting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700"></div>
        ) : (
          <>
            <BsEmojiSmile className="size-4 opacity-70" />I agree
          </>
        )}
      </button>
    </div>
  );
};

export default VotingSection;
