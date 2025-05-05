import { useContext } from 'react';
import { AnchorContext } from './AnchorContext';

export const useSharedAnchor = () => {
    const context = useContext(AnchorContext);
    if (!context) {
        throw new Error('useAnchor must be used within an AnchorProvider');
    }
    return context;
};