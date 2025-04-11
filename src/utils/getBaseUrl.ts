const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_ENV === 'dev') {
        console.log('Using local API URL: ',process.env.NEXT_PUBLIC_LOCAL_API_URL);
        return process.env.NEXT_PUBLIC_LOCAL_API_URL;
    } else {
        console.log('Using production API URL: ',process.env.NEXT_PUBLIC_API_URL);
        return process.env.NEXT_PUBLIC_API_URL;
    }
};

export default getBaseUrl;
