import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import auth from '../features/auth/authSlice';
import userTimers from '../features/user_timers/userTimersSlice';
import currentTimer from '../features/current_timer/currentTimerSlice';

const makeStore = () =>
    configureStore({
        reducer: {
            auth: auth.reducer,
            userTimers: userTimers.reducer,
            currentTimer: currentTimer.reducer,
        },
        devTools: process.env.NODE_ENV === 'development',
    });
// eslint-disable-next-line no-undef
export type AppStore = ReturnType<typeof makeStore>;
// eslint-disable-next-line no-undef
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    // eslint-disable-next-line no-undef
    unknown,
    Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
