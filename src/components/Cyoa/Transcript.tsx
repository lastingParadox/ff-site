import { useContext } from 'react';
import { ColorModeContext } from '@/pages/RootLayout';

export default function Transcript({ text, index }: { text: string, index: number }) {
    const { colorMode } = useContext(ColorModeContext);

    return (
        <div className="vm-transcript">
            <p key={index} style={{ color: 'var(--transcript-' + colorMode + ')' }}>{text}</p>
        </div>
    );
}