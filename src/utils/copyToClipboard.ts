import { CopyType } from '../types/CopyType';

const copyToClipboard = async (
    data: { type: CopyType; uuid: string }
): Promise<boolean> => {
    try {        
        const { type, uuid } = data;
        const url = `${window.location.origin}/${type}/${uuid}`;
        await navigator.clipboard.writeText(url);
        return true;
    } catch (err) {
        console.error('Clipboard copy failed:', err);
        return false;
    }
};

export default copyToClipboard;
