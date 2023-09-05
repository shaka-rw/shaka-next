import {
  getCartId,
  createCartCookie,
  deleteCartCookie,
} from '@/app/_actions/orders';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const useAnonymousCartId = () => {
  const session = useSession();
  const [cartSet, setCartSet] = useState(false);

  useEffect(() => {
    if (session?.data?.user) {
      deleteCartCookie();
      return setCartSet(true);
    }
    if (cartSet) return;
    getCartId().then(async ([error, cartId]) => {
      if (cartId) setCartSet(true);
      else await createCartCookie();
    });
  }, [cartSet, session?.data?.user]);

  return cartSet;
};

export default useAnonymousCartId;
