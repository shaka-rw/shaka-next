import prisma from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().min(10),
  shopId: z.string().trim(),
  sizes: z.array(z.string()),
  price: z.number().step(0.01).min(0.01),
  categories: z.array(z.string().trim()),
});

export async function GET(req: NextRequest) {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const jsonString = formData.get('product_data') as string;
  //   const images = formData.get('images');

  const data = JSON.parse(jsonString) as z.infer<typeof productSchema>;

  const product = await prisma.product.create({
    data: {
      ...data,
      categories: {
        connect: data.categories.map((id) => ({ id })),
      },
      sizes: {
        connectOrCreate: data.sizes.map((size) => ({
          create: { size },
          where: { size },
        })),
      },
    },
  });

  return NextResponse.json(product, { status: 201 });
}
export const dynamic = 'force-dynamic'
