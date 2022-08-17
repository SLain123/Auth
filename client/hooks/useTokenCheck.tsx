import { useCallback } from 'react';
import { useCheckTokenService } from 'service/TokenCheckService';
import { useAppDispatch } from './useAppDispatch';
import { setLoadingStatus, setUserAuthStatus } from 'features/auth/authSlice';

const useTokenCheck = () => {
    const dispatch = useAppDispatch();
    const { sendCheckRequest, error } = useCheckTokenService();

    const checkToken = useCallback(async (token: string | null) => {
        dispatch(setLoadingStatus(true));
        await sendCheckRequest(token)
            .then((result) => {
                if (!result || result.errors || error) {
                    dispatch(setUserAuthStatus(false));
                } else {
                    dispatch(setUserAuthStatus(result.validate));
                }
            })
            .catch(() => {
                dispatch(setUserAuthStatus(false));
            })
            .finally(() => {
                dispatch(setLoadingStatus(false));
            });
    }, []);

    return { checkToken };
};

export { useTokenCheck };
