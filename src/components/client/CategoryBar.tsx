/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { CategoryWithSubs } from '../CategoryList';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Simplebar from '../client/SimpleBar';

const DashboardCategories = ({
  categories,
  catId,
}: {
  categories: CategoryWithSubs[];
  catId?: string;
}) => {
  const params = useSearchParams();

  function removeQueryParam(url: string, paramKey: string) {
    const regex = new RegExp(`([?&])${paramKey}=.*?(&|$)`, 'i');
    return url.replace(regex, '$1').replace(/(&|\?)$/, '');
  }

  return (
    <>
      <div className="flex container my-4 mx-auto flex-col gap-3">
        <div className="flex items-center gap-4">
          <Simplebar className=" container rounded-3xl mx-auto">
            <div className="flex container rounded-3xl flex-row flex-nowrap  gap-2 items-center py-2 px-2 mx-auto">
              {categories.map((category) => (
                <Link
                  href={`/discover${
                    removeQueryParam('?' + params.toString() || 'n=1', 'cat') ||
                    category.id !== catId
                      ? '?'
                      : ''
                  }${category.id === catId ? '' : `cat=${category.id}`}`}
                  className={`btn btn-sm pr-4 capitalize rounded-3xl text-sm ${
                    category.id === catId ? 'btn-secondary' : ' btn-outline '
                  } `}
                  key={category.id}
                >
                  {category.name.slice(0, 40)}
                </Link>
              ))}
            </div>
          </Simplebar>
        </div>
      </div>
    </>
  );
};

export default DashboardCategories;
