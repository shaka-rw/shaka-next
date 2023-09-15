import prisma from '@/prisma';
import Image from 'next/image';
import React from 'react';
import EditProductImagesModal from './EditProductImageModal';
import SimpleProductSearch from './SimpleSearch';

const AdminProducts = async ({
  searchParams: { q: search },
}: {
  searchParams: { q?: string };
}) => {
  const products = await prisma.product.findMany({
    take: 20,

    ...(search
      ? {
          where: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { shop: { name: { contains: search, mode: 'insensitive' } } },
            ],
          },
        }
      : {}),
    include: {
      shop: { include: { image: true } },
      mainImage: true,
      colors: { include: { images: true, mainImage: true } },
    },
  });

  return (
    <div className="container mx-auto p-1">
      <div className="max-w-full overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>
                <SimpleProductSearch />
              </th>
              <th>Name</th>
              <th>Shop</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="avatar rounded overflow-hidden w-12 h-12 justify-center items-center  ">
                    <Image
                      height={48}
                      width={48}
                      src={p.mainImage.secureUrl}
                      className="w-full h-full object-contain"
                      alt={'Image'}
                    />
                  </div>
                </td>
                <td>{p.name}</td>
                <td>{p.shop.name}</td>
                <td>
                  <EditProductImagesModal product={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
