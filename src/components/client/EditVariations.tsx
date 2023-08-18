/* eslint-disable @next/next/no-img-element */
import { Product } from '@prisma/client';
import React from 'react';
import { VariationProduct } from '../forms/AddVariationsForm';

const EditVariations = ({ product }: { product: VariationProduct }) => {
  return (
    <div className="flex flex-col gap-2 my-1 border-b p-2">
      {product.quantities.map((q) => (
        <div key={q.id} className="flex items-center gap-2">
          <div className="avatar w-10 h-10">
            <div>
              <img
                src={q.color.mainImage.secureUrl}
                className="object-contain"
                alt="Image"
              />
            </div>
          </div>
          <div className=""> - </div>
          <div className=" uppercase">{q.size.size}</div>
          <div className=""> - </div>
          <div className=" uppercase">{q.quantity}</div>
          <div className=""> - </div>
          <div className="font-mono uppercase">{q.price}RWF</div>
        </div>
      ))}
    </div>
  );
};

export default EditVariations;
