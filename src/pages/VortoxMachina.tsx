import json from '@/assets/json/cyoa.json';
import Paragraph from '@/components/Cyoa/Paragraph';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAnchor } from '@/components/Anchor/AnchorContext';

export default function VortoxMachina() {
    const [searchParams] = useSearchParams();
    const lineParam = useMemo(() => searchParams.get('line'), [searchParams]);

    // I moved all the logic for scrolling to the anchor into the useEffect below
    // It waits for all blocks to be rendered before scrolling to the anchor
    // If it attempts to scroll before all blocks are rendered, it will NOT work
    const { scrollToAnchor, query } = useAnchor();
    useEffect(() => {
        if (lineParam) {
            scrollToAnchor(lineParam);
        }
    }, [lineParam]);

    return (
        <main>
            {json.map((line: { type: string; text: string; character?: string }, index: number) => {
                return (
                    <Paragraph
                        type={line.type}
                        text={line.text}
                        character={line.character}
                        index={index}
                        key={index}
                        highlight={index == query}
                    />
                );
            })}
        </main>
    );
}
