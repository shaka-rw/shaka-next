import prisma from '@/prisma';
import React, { Suspense } from 'react';
import CategoryBar from '../client/CategoryBar';

const DiscoverCategories = async ({ categoryId }: { categoryId?: string }) => {
  const categories = await prisma.category.findMany({
    take: 30,
    where: { parent: null },
    include: { image: true, subCategories: { include: { image: true } } },
  });

  return <CategoryBar catId={categoryId} categories={categories} />;
};

export default DiscoverCategories;
