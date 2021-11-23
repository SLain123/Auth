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
    isLoading: true,
    isError: false,
};

export const authSlice = createSlice({
    name: 'timersState',
    initialState: initialState,
    reducers: {
        setLoadingStatus: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setErrorStatus: (state, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
        saveTimerList: (state, action: PayloadAction<TimerI[]>) => {
            state.timerList = action.payload;
        },
    },
});

export const { setLoadingStatus, setErrorStatus, saveTimerList } =
    authSlice.actions;

export const getTimerListSelector = (state: AppState) => state.timersState;

export default authSlice;
