export const baseUrl =
    process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_BASE_URL_DEV
        : process.env.NEXT_PUBLIC_BASE_URL_PROD;

export const baseUrlApi = baseUrl + '/api';
