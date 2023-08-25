import CheckoutClient from '@/components/client/CheckoutClient';
import Navbar from '@/components/server/Navbar';
import prisma from '@/prima';
import { Cart } from '@prisma/client';
import { getCartId } from '../_actions/orders';

const CheckoutPage = async () => {
  // const session = await getServerSession(authOptions);

  // if (!session?.user) return <></>;
  const [error, cartId] = await getCartId();

  // if (error) return [error];

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      _count: { select: { quantities: true } },
      quantities: {
        include: {
          productQuantity: {
            include: {
              product: true,
              color: { include: { mainImage: true } },
              size: true,
            },
          },
        },
      },
    },
  });
  return (
    <div>
      <main className="min-h-screen">
        <Navbar />
        <div className="flex flex-col p-3">
          {cart ? (
            <CheckoutClient cart={cart} />
          ) : (
            <div className="flex items-center justify-center">
              <div className="alert alert-warning">Cart is empty!</div>
            </div>
          )}
        </div>
      </main>
      <div className="container mx-auto">x</div>
    </div>
  );
};

export default CheckoutPage;

export const dynamic = 'force-dynamic';
