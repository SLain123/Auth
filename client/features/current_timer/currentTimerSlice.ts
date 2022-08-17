import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../store/store';
import { ITimer } from '../../types/timer';

interface InitialStateI {
    timer: ITimer | null;
    isLoading: boolean;
    isError: boolean;
}

const initialState: InitialStateI = {
    timer: null,
    isLoading: false,
    isError: false,
};

export const currentTimerSlice = createSlice({
    name: 'currentTimer',
    initialState: initialState,
    reducers: {
        setLoadingStatus: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setErrorStatus: (state, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
        saveSingleTimer: (state, action: PayloadAction<ITimer>) => {
            state.timer = action.payload;
        },
    },
});

export const { setLoadingStatus, setErrorStatus, saveSingleTimer } =
    currentTimerSlice.actions;

export const getCurrentTimer = (state: AppState) => state.currentTimer;

export default currentTimerSlice;
