// app/api/set-role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();

    const client = await clerkClient();

    // Update the user's public metadata with their role
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting user role:', error);
    return NextResponse.json(
      { error: 'Failed to set user role' },
      { status: 500 }
    );
  }
}
