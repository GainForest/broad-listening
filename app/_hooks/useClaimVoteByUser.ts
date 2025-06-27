import { useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { v4 as uuidv4 } from "uuid";
import { Databases } from "appwrite";
import client from "@/lib/appwrite";

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

const useClaimVoteByUser = (claimId: string) => {
  const [userId] = useLocalStorage("bhutan-deepgov-user-id", uuidv4());
  const [vote, setVote] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserVote = async () => {
    if (!claimId || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const databases = new Databases(client);
      const collectionId =
        process.env.NEXT_PUBLIC_CLAIM_AND_USER_VOTE_COLLECTION_ID;

      if (!collectionId) {
        throw new Error("Collection ID not configured");
      }

      const documentId = createDocumentId(claimId, userId);

      const document = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
        collectionId,
        documentId
      );

      setVote(document.vote ?? null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // If document doesn't exist (404), user hasn't voted yet
      if (err.code === 404) {
        setVote(null);
        setError(null); // Clear any previous errors
      } else {
        console.error("Error fetching user vote:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch user vote"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserVote();
  }, [claimId, userId]);

  // Real-time subscription
  useEffect(() => {
    if (!claimId || !userId) return;

    const collectionId =
      process.env.NEXT_PUBLIC_CLAIM_AND_USER_VOTE_COLLECTION_ID;

    if (!collectionId) return;

    const documentId = createDocumentId(claimId, userId);

    // Subscribe to real-time updates
    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${collectionId}.documents.${documentId}`,
      (response) => {
        console.log("Real-time event received:", response);
        const payload = response.payload as { vote?: number };

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          // Document was updated
          console.log("Document updated, setting vote to:", payload.vote);
          setVote(payload.vote ?? null);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          // Document was created
          console.log("Document created, setting vote to:", payload.vote);
          setVote(payload.vote ?? null);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // Document was deleted
          console.log("Document deleted, setting vote to null");
          setVote(null);
        }
      }
    );

    // Cleanup subscription on unmount or when dependencies change
    return () => {
      unsubscribe();
    };
  }, [claimId, userId]);

  return { vote, loading, error, userId, refetch: fetchUserVote };
};

export default useClaimVoteByUser;
