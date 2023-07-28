import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../shops/route';

export const GET = async (req: NextRequest) => {
  const user = getCurrentUser();
  if (user instanceof NextResponse) return user;
  return NextResponse.json(user);
};
export const dynamic = 'force-dynamic'
