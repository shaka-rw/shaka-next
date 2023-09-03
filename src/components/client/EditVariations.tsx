/* eslint-disable @next/next/no-img-element */
import { Product } from '@prisma/client';
import React from 'react';
import { VariationProduct } from '../forms/AddVariationsForm';
import Image from 'next/image';

const EditVariations = ({ product }: { product: VariationProduct }) => {
  return (
    <div className="flex flex-col gap-2 my-1 border-b p-2">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {product.quantities.map((q) => (
              <tr key={q.id}>
                <td>
                  <div className="flex items-center space-x-2">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10">
                        <Image height={40} width={40} src={q.color.mainImage.secureUrl} alt="Image" />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{q.size.size}</td>
                <td>{q.quantity}</td>
                <td>{q.price + ' '} RWF</td>
              </tr>
              // <div key={q.id} className="flex items-center gap-2">
              //   <div className="avatar w-10 h-10">
              //     <div>
              //       <img
              //         src={q.color.mainImage.secureUrl}
              //         className="object-contain"
              //         alt="Image"
              //       />
              //     </div>
              //   </div>
              //   <div className=""> - </div>
              //   <div className=" uppercase">{q.size.size}</div>
              //   <div className=""> - </div>
              //   <div className=" uppercase">{q.quantity}</div>
              //   <div className=""> - </div>
              //   <div className="font-mono uppercase">{q.price}RWF</div>
              // </div>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditVariations;
