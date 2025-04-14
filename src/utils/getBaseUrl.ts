/**
 * @brief Switches between local and production API URLs based on the environment variable.
 */
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_ENV === 'dev') {
        return process.env.NEXT_PUBLIC_LOCAL_API_URL;
    } else {
        return process.env.NEXT_PUBLIC_API_URL;
    }
};

export default getBaseUrl;
