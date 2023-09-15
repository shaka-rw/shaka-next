'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import React from 'react';

const SimpleProductSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get('q') ?? '');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!search) return router.push(pathname);
    const query = new URLSearchParams();
    if (search) query.append('q', search as string);
    router.push(`${pathname}?${query.toString()}`);
  };

  return (
    <input
      type="search"
      name="search"
      onKeyUp={(e) => {
        if (e.key === 'Enter') handleSearch(e);
      }}
      defaultValue={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search"
      className="input input-sm input-bordered"
    />
  );
};

export default SimpleProductSearch;
