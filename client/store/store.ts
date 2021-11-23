import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import authState from '../features/auth/authSlice';
import timersState from '../features/timers/timersSlice';

const makeStore = () =>
    configureStore({
        reducer: {
            authState: authState.reducer,
            timersState: timersState.reducer,
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
