const formatHeartCount = (count: number): string => {
    if (count >= 1_000_000_000) {
        return (count / 1_000_000_000).toFixed(1) + 'B'; // For billion
    } else if (count >= 1_000_000) {
        return (count / 1_000_000).toFixed(1) + 'M'; // For million
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K'; // For thousand
    } else if(count === 0){
        return ('💀');
    } else {
        return count.toString(); // If it's less than 1000, return the number
    }
};

export default formatHeartCount;