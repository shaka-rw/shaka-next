'use server';

import prisma from '@/prisma';

export async function searchProducts(query: string = '') {
  const products = await prisma.product.findMany({
    take: 10,
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          categories: {
            some: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          shop: {
            OR: [
              {
                name: { contains: query, mode: 'insensitive' },
              },
              {
                category: { name: { contains: query, mode: 'insensitive' } },
              },
            ],
          },
        },
      ],
    },
    include: {
      categories: true,
      mainImage: true,
      shop: true,
    },
  });

  return products;
}
