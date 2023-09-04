import { completeDelivery, startDelivery } from '@/app/_actions/orders';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  Asset,
  Order,
  OrderQuantities,
  Payment,
  Product,
  ProductColor,
  ProductSize,
  Shop,
  User,
} from '@prisma/client';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { BsCheck } from 'react-icons/bs';

export type FullOrder = Order & {
  quantities: (OrderQuantities & {
    productQuantity: {
      product: Product;
      color: ProductColor & { mainImage: Asset };
      size: ProductSize;
    };
  })[];
  shops: Shop[];
  customer: User | null;
  payments: Payment[];
};

const SingleOrderCard = async ({ order }: { order: FullOrder }) => {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role as
    | 'ADMIN'
    | 'SELLER'
    | 'CUSTOMER'
    | undefined;

  const orderData = {
    customer: {
      name: order.customer?.name ?? 'Anonymous',
    },
    items: order.quantities.map((quantity) => ({
      id: quantity.id,
      name: quantity.productQuantity.product.name,
      variants: {
        color: quantity.productQuantity.color.mainImage.secureUrl,
        size: quantity.productQuantity.size.size,
      },
      quantity: quantity.quantity,
      price: quantity.price,
    })),

    totalCost: order.quantities.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    ),
    status: order.status,
    paid: order.isPaid,
  };

  return (
    <div className="bg-base-100 border rounded-xl justify-between  shadow-md p-4 mb-4">
      <div className="flex border-b pb-2 justify-between mb-4">
        <div>
          <h2 className="text-lg flex flex-col font-semibold">
            <span className="uppercase text-xs text-primary">Customer</span>
            <span>{orderData.customer.name}</span>
          </h2>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-accent">
            {orderData.status}
          </h2>
          {orderData.paid && (
            <span
              className={`${
                orderData.status === 'COMPLETED'
                  ? 'text-green-500 '
                  : orderData.status === 'CANCELED'
                  ? ' text-red-600 '
                  : ' text-blue-600 '
              } `}
            >
              Paid
            </span>
          )}
        </div>
      </div>

      <div className="collapse bg-base-100 border">
        <input type="checkbox" />
        <div className="collapse-title flex py-2 justify-between items-center text-xl font-medium">
          <div className="flex flex-col">
            <span>Order Items</span>
            <span className="text-xs text-primary uppercase">
              click to show/hide items
            </span>
          </div>
          <span>{orderData.items.length}</span>
        </div>
        <div className="collapse-content">
          <a href="#" className="border-t border-gray-300 pt-2">
            {orderData.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[auto,1fr]  hover:bg-base-200 p-1 rounded-md gap-2 items-center mb-2"
              >
                <Image
                  src={item.variants.color}
                  alt={item.variants.size}
                  height={40}
                  width={40}
                  className="h-10 rounded-md object-cover w-10"
                />
                <span className="flex flex-col">
                  <span>
                    {item.name} - {item.variants.size} - Quantity:{' '}
                    {item.quantity}
                  </span>
                  <span className="text-gray-500">{item.price}RWF each</span>
                </span>
              </div>
            ))}
          </a>
        </div>
      </div>
      <div className="mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left pr-4 py-2"></th>
              <th className="text-right pr-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="pr-4 py-2">Total Paid Amount:</td>
              <td className="text-right pr-4 py-2">
                {orderData.totalCost + 2000} RWF
              </td>
            </tr>
            {role === 'ADMIN' || role === 'SELLER' ? (
              <>
                <tr className="border-b border-gray-300">
                  <td className="pr-4 py-2">Platform Share:</td>
                  <td className="text-right pr-4 py-2">
                    {(orderData.totalCost / 1.1) * 0.1} RWF
                  </td>
                </tr>
                <tr>
                  <td className="pr-4 py-2">Seller Share:</td>
                  <td className="text-right pr-4 py-2">
                    {orderData.totalCost / 1.1} RWF
                  </td>
                </tr>
              </>
            ) : (
              <></>
            )}
            <tr className="border-b border-gray-300">
              <td className="pr-4 py-2">Delivery Fee:</td>
              <td className="text-right pr-4 py-2">2000 RWF</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex gap-2  items-center  mt-4 justify-end">
        {role === 'ADMIN' && orderData.status === 'PENDING' ? (
          <form action={startDelivery}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              className="btn btn-secondary rounded-3xl btn-sm"
              type="submit"
            >
              <BsCheck className="inline mr-2" />
              Start Delivery
            </button>
          </form>
        ) : (
          <></>
        )}
        {role === 'CUSTOMER' && orderData.status === 'DELIVERY' ? (
          <form action={completeDelivery}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              className="btn btn-sm btn-primary rounded-3xl"
              type="submit"
            >
              <BsCheck className="inline mr-2" />
              Complete Delivery
            </button>
          </form>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SingleOrderCard;
