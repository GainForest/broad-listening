import { useEffect, useState, useCallback } from "react";
import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

const DATABASE_ID = "votes";
const COLLECTION_ID = "votes";

export function useVotes(claimId: string) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const userId = useUserId();

  console.log(userId);

  // Fetch or create the vote document
  const fetchVotes = useCallback(async () => {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        claimId
      );
      setCount(doc.count);
    } catch {
      // If it doesn't exist, create it
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, claimId, {
        claimId,
        count: 0,
      });
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [claimId]);

  // Upvote / downvote
  const vote = async (delta: number) => {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      claimId
    );
    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, claimId, {
      count: doc.count + delta,
    });
  };

  useEffect(() => {
    fetchVotes();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.${claimId}`,
      (res) => {
        const newCount = res.payload.count;
        if (typeof newCount === "number") {
          setCount(newCount);
        }
      }
    );

    return () => unsubscribe(); // clean up
  }, [fetchVotes, claimId]);

  return {
    count,
    loading,
    vote,
  };
}

function useUserId() {
  const [userId, setUserId] = useState<string | null>(
    global?.localStorage?.getItem("userId")
  );

  useEffect(() => {
    if (!userId) {
      const userId = crypto.randomUUID();
      global?.localStorage?.setItem("userId", userId);
      setUserId(userId);
    }
  }, [userId]);

  return userId;
}
