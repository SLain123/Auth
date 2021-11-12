import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';

const useProfileService = () => {
    const { loading, request } = useHttp();
    const [serverErrrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies, setCookie] = useCookies(['authData']);

    const getUserData = async () => {
        try {
            request('http://localhost:5000/api/profile', 'GET', null, {
                authorization: cookies.authData.token,
            }).then(({ firstName, lastName, avatar, errors }) => {
                setUserDataLoading(false);
                if (errors) {
                    setServerErrors(errors);
                } else {
                    setServerErrors([]);
                    setUserData({
                        firstName,
                        lastName,
                    });
                    setAvatarPreview(avatar);

                    formik.setValues({
                        firstName,
                        lastName,
                    });
                }
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
            setUserDataLoading(false);
        }
    };

    return { getUserData, loading, serverErrrors, resultMessage };
};

export default useProfileService;
