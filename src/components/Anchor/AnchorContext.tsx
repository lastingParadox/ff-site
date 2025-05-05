import React, { createContext, useContext, useMemo, useState, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface AnchorContextType {
    lineParam: string | null;
    query: number;
    setQuery: (query: number) => void;
    scrollToAnchor: (lineParam: string | null) => void;
}

export const AnchorContext = createContext<AnchorContextType | undefined>(undefined);

export const AnchorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchParams] = useSearchParams();
    const lineParam = useMemo(() => searchParams.get('line'), [searchParams]);
    const [query, setQuery] = useState<number>(-1);

    // Method to scroll to an element by id
    const scrollToAnchor = (lineParam: string | null) => {
        if (lineParam) {
            const id = parseInt(lineParam);
            setQuery(id);
            const element = document.getElementById(`${id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    return (
        <AnchorContext.Provider value={{ lineParam, query, setQuery, scrollToAnchor }}>
            {children}
        </AnchorContext.Provider>
    );
};

export const useAnchor = (): AnchorContextType => {
    const context = useContext(AnchorContext);
    if (!context) {
        throw new Error('useAnchor must be used within an AnchorProvider');
    }
    return context;
};