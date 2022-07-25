import useHttp from '../hooks/useHttp';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
    setLoadingStatus,
    setUserAuthStatus,
} from '../features/auth/authSlice';
import { baseUrlApi } from './baseEnv';

const useCheckTokenService = (token: string | null) => {
    const { loading, request } = useHttp();
    const dispatch = useAppDispatch();

    const checkToken = async () => {
        try {
            token
                ? request(`${baseUrlApi}/auth/check`, 'GET', null, {
                      authorization: token,
                  }).then((data) => {
                      if (!data) {
                          dispatch(setUserAuthStatus(false));
                          dispatch(setLoadingStatus(false));
                          return;
                      }

                      if (data.errors) {
                          dispatch(setUserAuthStatus(false));
                      } else {
                          dispatch(setUserAuthStatus(data.validate));
                      }
                      dispatch(setLoadingStatus(loading));
                  })
                : dispatch(setLoadingStatus(false));
        } catch (e) {
            //@ts-ignore
            dispatch(setUserAuthStatus(false));
            dispatch(setLoadingStatus(loading));
        }
    };

    return { checkToken };
};

export default useCheckTokenService;
