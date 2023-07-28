import prisma from '@/prima';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '../shops/route';

const catSchema = z.object({ name: z.string().trim().min(1) });

export async function POST(req: NextRequest) {
  const data = (await req.json()) as z.infer<typeof catSchema>;

  const user = await getCurrentUser();
  if (user instanceof NextResponse) return user;
  if (user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Access Denied' }, { status: 403 });

  const category = await prisma.category.create({ data });

  return NextResponse.json(category, { status: 201 });
}

export async function GET(req: NextRequest) {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}
export const dynamic = 'force-dynamic'
