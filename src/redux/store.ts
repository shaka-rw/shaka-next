import { configureStore } from '@reduxjs/toolkit';
import mainApi from './api';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
// ...
const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(mainApi.middleware);
  },
});
export type RootState = ReturnType<typeof store.getState>;

setupListeners(store.dispatch);

export default store;
