import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAdmin: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        UserIfExists: (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        userIfNotExists: (state) => {
            state.user = null;
            state.isLoading = false;
        }
    }
});

export default authSlice;
export const { UserIfExists, userIfNotExists } = authSlice.actions;