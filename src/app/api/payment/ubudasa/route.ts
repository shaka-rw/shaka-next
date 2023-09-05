import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  console.log('POST /api/payment/ubudasa');
  try {
    console.dir({ req, body: req.body });
    console.dir(await req.json());
  } catch (error) {}
  return NextResponse.json({ message: 'CHECK THE CONSOLE' });
};
export const GET = async (req: NextRequest) => {
  console.log('GET /api/payment/ubudasa');
  try {
    console.dir({ req, body: req.body });
    console.dir(await req.json());
  } catch (error) {}
  return NextResponse.json({ message: 'CHECK THE CONSOLE' });
};
