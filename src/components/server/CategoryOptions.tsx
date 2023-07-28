import prisma from '@/prima';
import React from 'react';

const CategoryOptions = async () => {
  const options = await prisma.category.findMany();
  return (
    <>
      {options.map((cat: any) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </>
  );
};

export default CategoryOptions;
