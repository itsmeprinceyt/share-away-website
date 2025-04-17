/**
 * @brief Switches between local and production API URLs based on the environment variable.
 */
const getBaseUrl = () => {
    switch (process.env.NEXT_PUBLIC_ENV) {
        case 'dev':
            return process.env.NEXT_PUBLIC_LOCAL_API_URL;
        case 'prod':
            return process.env.NEXT_PUBLIC_API_URL;
        default:
            console.warn('Unknown environment: Falling back to production API');
            return process.env.NEXT_PUBLIC_API_URL;
    }
};
export default getBaseUrl;