import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../store/store';
import { ITimer } from '../../types/timer';

interface InitialStateI {
    timer: ITimer;
    isLoading: boolean;
    isError: boolean;
}

const initialState: InitialStateI = {
    timer: {
        _id: '0',
        label: '',
        total: 0,
        activateDate: new Date(0),
        timeToEnd: null,
        ownerNick: '',
        restTime: 0,
        ownerId: '',
    },
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
