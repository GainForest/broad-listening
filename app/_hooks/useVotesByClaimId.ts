import { useState, useEffect } from "react";
import { Databases } from "appwrite";
import client from "@/lib/appwrite";

const useVotesByClaimId = (claimId: string) => {
  const [votes, setVotes] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      if (!claimId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const databases = new Databases(client);
        const collectionId = process.env.NEXT_PUBLIC_CLAIM_VOTES_COLLECTION_ID;

        if (!collectionId) {
          throw new Error("Collection ID not configured");
        }

        const document = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
          collectionId,
          claimId
        );

        setVotes(document.votes || 0);
      } catch (err) {
        console.error("Error fetching votes:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch votes");
        setVotes(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [claimId]);

  return { votes, loading, error };
};

export default useVotesByClaimId;
