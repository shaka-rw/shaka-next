'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const mainApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 10,
  endpoints: (builder) => ({
    getAllShops: builder.query({ query: () => 'shops' }),
    getProducts: builder.query({ query: () => 'products' }),
    getCategories: builder.query({ query: () => 'categories' }),
    addCategoryMutation: builder.mutation({
      query: (data) => ({ method: 'POST', body: data, url: 'categories' }),
    }),
    asddProductMutation: builder.mutation({
      query: (data) => ({ method: 'POST', body: data, url: 'products' }),
    }),
    addShopMutation: builder.mutation({
      query: (data) => ({ method: 'POST', body: data, url: 'shops' }),
    }),
  }),
});

export default mainApi;
