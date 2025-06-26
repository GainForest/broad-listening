import { NextRequest, NextResponse } from 'next/server';
import { ref, get, set } from 'firebase/database';
import { database } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, vote } = body;

    // Validate required fields
    if (!claimId || vote === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: claimId, vote' },
        { status: 400 }
      );
    }

    // Validate vote value
    if (vote < -1 || vote > 1 || !Number.isInteger(vote)) {
      return NextResponse.json(
        { error: 'Invalid vote. Must be an integer from -1 to 1' },
        { status: 400 }
      );
    }

    // Get current vote for the claim
    const claimVoteRef = ref(database, `claimVotes/${claimId}`);
    const claimVoteSnapshot = await get(claimVoteRef);

    let currentVote = 0;
    if (claimVoteSnapshot.exists()) {
      currentVote = claimVoteSnapshot.val();
    }

    // Update the vote
    await set(claimVoteRef, vote);
    
    return NextResponse.json({
      message: 'Vote updated',
      claimId,
      previousVote: currentVote,
      newVote: vote
    });

  } catch (error) {
    console.error('Error voting for claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const claimId = searchParams.get('claimId');

    if (!claimId) {
      return NextResponse.json(
        { error: 'Missing claimId parameter' },
        { status: 400 }
      );
    }

    // Get vote for the claim
    const claimVoteRef = ref(database, `claimVotes/${claimId}`);
    const claimVoteSnapshot = await get(claimVoteRef);

    if (!claimVoteSnapshot.exists()) {
      return NextResponse.json({
        claimId,
        vote: 0
      });
    }

    const vote = claimVoteSnapshot.val();

    return NextResponse.json({
      claimId,
      vote
    });

  } catch (error) {
    console.error('Error getting vote for claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 