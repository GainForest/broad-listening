import { useEffect, useState, useCallback } from "react";
import { Client, Databases, Permission, Role } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

const DATABASE_ID = "685e0618003426c812af";
const COLLECTION_ID = "685e06c20025f9db67ee";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Force 32-bit
  }
  return Math.abs(hash).toString(36);
}

export function useVotes(claimId: string) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const userId = useUserId();
  const documentId = simpleHash(`${claimId}_${userId}`);
  console.log(documentId);
  // Fetch or create the vote document
  const fetchVotes = useCallback(async () => {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        documentId
      );
      setCount(doc["vote-value"]);
    } catch {
      // If it doesn't exist, create it
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        documentId,
        {
          "claim-id": claimId,
          "user-id": userId,
          "vote-value": 0,
        },
        [Permission.read(Role.any()), Permission.update(Role.any())]
      );
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [claimId]);

  // Upvote / downvote
  const vote = async (delta: number) => {
    console.log(delta);
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );
    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, {
      "user-id": userId,
      "claim-id": claimId,
      "vote-value": doc["vote-value"] + delta,
    });
  };

  useEffect(() => {
    fetchVotes();

    // const unsubscribe = client.subscribe(
    //   `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.${documentId}`,
    //   (res) => {
    //     const newCount = (res.payload as { "vote-value": number })[
    //       "vote-value"
    //     ];
    //     if (typeof newCount === "number") {
    //       setCount(newCount);
    //     }
    //   }
    // );

    // return () => unsubscribe(); // clean up
  }, [fetchVotes, documentId]);

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
