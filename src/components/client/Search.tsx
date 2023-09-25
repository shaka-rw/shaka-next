'use client';
import { searchProducts } from '@/app/_actions/search';
import { Asset, Product } from '@prisma/client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';
import { Modal } from '../Modal';
import { MdEmojiObjects, MdSearch } from 'react-icons/md';
import { sliceText } from '@/lib/helpers';
import Link from '../server/Link';

interface SearchResultsProps {
  products: (Product & { mainImage: Asset })[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ products }) => {
  return (
    <div className="flex flex-col">
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-bold">
            <MdEmojiObjects /> No results found
          </div>
        </div>
      )}
      <ul className="menu w-full p-0">
        {products.map((prod) => (
          <li key={prod.id}>
            <Link href={`/products/${prod.id}`}>
              <div className="avatar">
                <div>
                  <Image
                    src={prod.mainImage.secureUrl}
                    alt={prod.name}
                    width={40}
                    height={40}
                    className="rounded-2xl"
                  />
                </div>
              </div>
              <p className="ml-1 text-lg">{sliceText(prod.name, 50)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface SearchInputProps {
  onChange: (query: string) => void;
  disabled?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onChange,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const debouncedOnChange = useDebounce<string>(searchQuery, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    onChange(debouncedOnChange);
  }, [debouncedOnChange, onChange]);

  return (
    <input
      type="text"
      disabled={disabled}
      className="input input-bordered w-full input-lg"
      placeholder="Search..."
      autoFocus
      value={searchQuery}
      onChange={handleSearchChange}
    />
  );
};

interface SearchState {
  searchQuery: string;
  results: (Product & { mainImage: Asset })[];
}

const SearchModal: React.FC<{ isNotHome: boolean }> = ({
  isNotHome = true,
}) => {
  const [state, setState] = React.useState<SearchState>({
    searchQuery: '',
    results: [],
  });
  const [isPending, startTransition] = React.useTransition();

  const handleSearchChange = (query: string) => {
    if (isPending || query === state.searchQuery || query.trim().length === 0) {
      return;
    }

    startTransition(async () => {
      const results = (await searchProducts(query)) as (Product & {
        mainImage: Asset;
      })[];
      setState((prevState) => ({ ...prevState, searchQuery: query, results }));
    });
  };

  return (
    <Modal
      btn={
        <button
          className={`btn btn-sm bg-transparent border-0 btn-square font-extrabold text-xl ${
            isNotHome ? '  ' : ' text-base-100 hover:text-base-content '
          }`}
        >
          <MdSearch />
        </button>
      }
      btnContent={<></>}
    >
      <div className="flex flex-col gap-3 w-full p-2">
        <h3 className="my-2 text-2xl font-bold">Search</h3>
        <SearchInput disabled={isPending} onChange={handleSearchChange} />
        {isPending ? (
          <>
            <div className="p-4 flex items-center gap-4 justify-center m-2 w-full">
              <span className="loading loading-dots loading-lg" />
            </div>
          </>
        ) : (
          <SearchResults products={state.results} />
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
