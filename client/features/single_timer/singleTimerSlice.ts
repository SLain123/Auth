import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../store/store';
import { TimerI } from '../../types/timer';

interface InitialStateI {
    timerList: TimerI[] | [];
    isLoading: boolean;
    isError: boolean;
}

const initialState: InitialStateI = {
    timerList: [],
    isLoading: false,
    isError: false,
};

export const allTimerSlice = createSlice({
    name: 'allTimers',
    initialState: initialState,
    reducers: {
        setLoadingStatus: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setErrorStatus: (state, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
        saveSingleTimer: (state, action: PayloadAction<TimerI>) => {
            state.timerList = [...state.timerList, action.payload];
        },
    },
});

export const { setLoadingStatus, setErrorStatus, saveSingleTimer } =
    allTimerSlice.actions;

export const getTimerListSelector = (state: AppState) => state.allTimers;

export default allTimerSlice;
