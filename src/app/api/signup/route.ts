import prisma from '@/prima';
import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      name: `${data.firstName} ${data.lastName}`,
    },
  });

  return NextResponse.json({ user });
};
export const dynamic = 'force-dynamic'
