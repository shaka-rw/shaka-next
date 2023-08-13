import CheckoutClient from '@/components/client/CheckoutClient';
import Navbar from '@/components/server/Navbar';
import prisma from '@/prima';
import { Cart } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

const CheckoutPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) return <></>;

  const cart = await prisma.cart.findUnique({
    where: { userId: session?.user?.id },
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
        <div className="flex justify-center items-center p-3">
          <CheckoutClient cart={cart as Cart} />
        </div>
      </main>
      <div className="container mx-auto">Checkout Here</div>
    </div>
  );
};

export default CheckoutPage;

export const dynamic = 'force-dynamic';
