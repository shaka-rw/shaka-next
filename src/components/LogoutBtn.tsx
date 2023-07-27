'use client';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MdLogout } from 'react-icons/md';

const LogoutBtn = () => {
  const pathname = usePathname();
  const session = useSession();

  return (
    <button
      onClick={() => signOut({ redirect: true, callbackUrl: pathname ?? '/' })}
      type="button"
    >
      <MdLogout /> Logout
    </button>
  );
};

export default LogoutBtn;
