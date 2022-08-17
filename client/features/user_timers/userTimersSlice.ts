import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../store/store';
import { ITimer } from '../../types/timer';

interface InitialStateI {
    timerList: ITimer[] | [];
    isLoading: boolean;
    isError: boolean;
}

const initialState: InitialStateI = {
    timerList: [],
    isLoading: true,
    isError: false,
};

export const userTimersSlice = createSlice({
    name: 'userTimers',
    initialState: initialState,
    reducers: {
        setLoadingStatus: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setErrorStatus: (state, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
        saveUserTimerList: (state, action: PayloadAction<ITimer[]>) => {
            state.timerList = action.payload;
        },
    },
});

export const { setLoadingStatus, setErrorStatus, saveUserTimerList } =
    userTimersSlice.actions;

export const getTimerListSelector = (state: AppState) => state.userTimers;

export default userTimersSlice;
