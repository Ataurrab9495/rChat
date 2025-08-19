import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Reducers/auth';
import api from "./api/api";
import miscSlice from './Reducers/misc';

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: mid => [...mid(), api.middleware],
});

export default store;