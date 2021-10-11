import { useState, useCallback } from 'react';

const useHttp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | boolean>(false);

    const request = useCallback(
        async (
            url: string,
            method: string = 'GET',
            body: any = null,
            headers: any = {},
        ) => {
            setLoading(true);
            try {
                if (body) {
                    body = JSON.stringify(body);
                    headers['Content-Type'] = 'application/json';
                }
                
                const response = await fetch(url, { method, body, headers });
                const data = await response.json();

                if (!response.ok) {
                    setError(data.message);
                }
                setLoading(false);

                return data;
            } catch (e) {
                setLoading(false);
                setError(e.message);
            }
        },
        [],
    );

    return { request, loading, error };
};

export default useHttp;
