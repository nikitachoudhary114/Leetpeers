import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// Fetch LeetCode profile bio
async function fetchLeetCodeBio(username: string): Promise<string | null> {
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          profile {
            aboutMe
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.data?.matchedUser?.profile?.aboutMe || null;
  } catch (error) {
    console.error('Error fetching LeetCode bio:', error);
    return null;
  }
}

// Fetch GitHub profile bio
async function fetchGitHubBio(username: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'LeetPeers-App',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.bio || null;
  } catch (error) {
    console.error('Error fetching GitHub bio:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await request.json();

    if (!type || !['leetcode', 'github'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    // Get the pending verification
    const verification = await prisma.profileVerification.findUnique({
      where: {
        userId_type: {
          userId: session.user.id,
          type,
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'No pending verification found. Please start verification first.' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > verification.expiresAt) {
      await prisma.profileVerification.delete({
        where: { id: verification.id },
      });
      return NextResponse.json(
        { error: 'Verification code has expired. Please start again.' },
        { status: 400 }
      );
    }

    // Fetch the bio based on type
    let bio: string | null = null;
    if (type === 'leetcode') {
      bio = await fetchLeetCodeBio(verification.username);
    } else if (type === 'github') {
      bio = await fetchGitHubBio(verification.username);
    }

    if (bio === null) {
      return NextResponse.json(
        { error: `Could not fetch ${type} profile. Please check if the username "${verification.username}" is correct.` },
        { status: 400 }
      );
    }

    // Check if the code is in the bio
    if (!bio.includes(verification.code)) {
      return NextResponse.json({
        success: false,
        error: `Verification code not found in your ${type} profile bio. Please add "${verification.code}" to your bio and try again.`,
      });
    }

    // Verification successful - update user profile
    const updateData = type === 'leetcode'
      ? { leetcodeProfile: verification.username, leetcodeVerified: true }
      : { githubProfile: verification.username, githubVerified: true };

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Delete the verification record
    await prisma.profileVerification.delete({
      where: { id: verification.id },
    });

    return NextResponse.json({
      success: true,
      message: `${type === 'leetcode' ? 'LeetCode' : 'GitHub'} profile verified successfully!`,
      username: verification.username,
    });
  } catch (error) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { error: 'Failed to verify profile' },
      { status: 500 }
    );
  }
}
