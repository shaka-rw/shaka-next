import React from 'react';
import AddSizeToCategory from './AddSizeToCategory';
import prisma from '@/prisma';

const AdminSizesPage = async () => {
  const categories = await prisma.category.findMany({
    where: { parent: null },
    include: { image: true, productSizes: true },
  });

  const allSizes = await prisma.productSize.findMany({ distinct: 'size' });

  return (
    <div className="container mx-auto p-1">
      <AddSizeToCategory categories={categories} existingSizes={allSizes} />
    </div>
  );
};

export default AdminSizesPage;
