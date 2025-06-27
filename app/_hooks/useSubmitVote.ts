import { useState } from "react";
import { Databases } from "appwrite";
import client from "@/lib/appwrite";
import useLocalStorage from "use-local-storage";
import { v4 as uuidv4 } from "uuid";

// Simple hash function to create document ID from claimId and userId
const createDocumentId = (claimId: string, userId: string): string => {
  const combined = `${claimId}-${userId}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

const useSubmitVote = () => {
  const [userId] = useLocalStorage("bhutan-deepgov-user-id", uuidv4());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitVote = async (
    claimId: string,
    vote: number,
    currentVote: number | null,
    onSuccess?: () => void
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      const databases = new Databases(client);
      const userVoteCollectionId =
        process.env.NEXT_PUBLIC_CLAIM_AND_USER_VOTE_COLLECTION_ID;
      const claimVotesCollectionId =
        process.env.NEXT_PUBLIC_CLAIM_VOTES_COLLECTION_ID;

      if (!userVoteCollectionId || !claimVotesCollectionId) {
        throw new Error("Collection IDs not configured");
      }

      const documentId = createDocumentId(claimId, userId);

      // Calculate vote change for updating the total votes count
      let voteChange = 0;

      // If clicking the same vote, delete the document (remove vote)
      if (currentVote === vote) {
        try {
          await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
            userVoteCollectionId,
            documentId
          );
          // Remove the current vote from total
          voteChange = -currentVote;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          // If document doesn't exist, that's fine - it's already "deleted"
          if (err.code !== 404) {
            throw err;
          }
        }
      } else {
        // Calculate vote change for updating total
        if (currentVote !== null) {
          // User is changing their vote
          voteChange = vote - currentVote;
        } else {
          // User is voting for the first time
          voteChange = vote;
        }

        // Create or update the user's vote
        try {
          // Try to create the document first
          await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
            userVoteCollectionId,
            documentId,
            { vote }
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          // If document already exists (409 conflict), update it
          if (err.code === 409) {
            await databases.updateDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
              userVoteCollectionId,
              documentId,
              { vote }
            );
          } else {
            throw err;
          }
        }
      }

      // Update the total votes count for the claim
      if (voteChange !== 0) {
        try {
          // Get current votes count
          const currentVotesDoc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
            claimVotesCollectionId,
            claimId
          );

          const currentVotes = currentVotesDoc.votes || 0;
          const newVotes = currentVotes + voteChange;

          // Update the votes count
          await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
            claimVotesCollectionId,
            claimId,
            { votes: newVotes }
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          // If claim votes document doesn't exist, create it
          if (err.code === 404) {
            await databases.createDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
              claimVotesCollectionId,
              claimId,
              { votes: voteChange }
            );
          } else {
            console.error("Error updating votes count:", err);
            // Don't throw here, as the user vote was successful
          }
        }
      }

      onSuccess?.();
      return true;
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError(err instanceof Error ? err.message : "Failed to submit vote");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitVote, submitting, error };
};

export default useSubmitVote;
