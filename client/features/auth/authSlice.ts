import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from 'store/store';

interface InitialStateI {
    isUserAuth: boolean;
    isLoading: boolean;
}

const initialState: InitialStateI = {
    isUserAuth: false,
    isLoading: true,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setLoadingStatus: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setUserAuthStatus: (state, action: PayloadAction<boolean>) => {
            state.isUserAuth = action.payload;
        },
    },
});

export const { setLoadingStatus, setUserAuthStatus } = authSlice.actions;

export const getAuthSelector = (state: AppState) => state.auth;

export default authSlice;
