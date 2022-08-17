import { useCheckTokenService } from '../service/TokenCheckService';
import { useAppDispatch } from './useAppDispatch';
import {
    setLoadingStatus,
    setUserAuthStatus,
} from '../features/auth/authSlice';

const useTokenCheck = (token: string | null) => {
    const { sendCheckRequest, error } = useCheckTokenService(token);
    const dispatch = useAppDispatch();

    const checkToken = async () => {
        dispatch(setLoadingStatus(true));
        sendCheckRequest()
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
    };

    return { checkToken };
};

export { useTokenCheck };
