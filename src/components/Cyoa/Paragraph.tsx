import { useContext, useState, useEffect } from 'react';
import { ColorModeContext } from '@/pages/RootLayout';
import './vm.scss';
import CharacterColors from '@/assets/json/characterColors.json';
import { getCharacterColor } from '@/utils/colors';
import Divider from '@mui/material/Divider';
import Anchor from '../Anchor/Anchor';

export default function Paragraph({
    type,
    text,
    character,
    index,
    highlight
}: { type: string; text: string; character?: string; index: number, highlight: boolean }): JSX.Element {
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        console.log("I'm rendering paragraph " + index);
    }, [])
    
    return (
        <div 
            id={`${index}`}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1,
                backgroundColor: highlight ? ` #ffffff20` : 'none',
                padding: '0rem 1rem', borderRadius: '0.5rem',
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {(() => {
                switch (type) {
                    case "narration":
                        return <Narration text={text} index={index} />;
                    case "dialogue":
                        return <Dialogue character={character || "Unknown"} text={text} index={index} />;
                    case "action":
                        return <Action text={text} index={index} />;
                    case "transcript":
                        return <>
                            <Transcript text={text} index={index} />
                            <Divider />
                        </>;
                    default:
                        return <p key={index}><span style={{ color: "red" }}>Error</span></p>;
                }
            })()}
            <Anchor isHovering={hovering} id={index} />
        </div>
    )
}

// Inner components for different types of paragraphs
function Narration({ text, index }: { text: string, index: number }) {
    return (
        <p className="vm-narration" key={index}>{text}</p>
    );
}

function Dialogue({ character, text, index }: { character: string; text: string; index: number }) {
    const { colorMode } = useContext(ColorModeContext);
    return (
        <p className='vm-dialogue' key={index} style={{ color: getCharacterColor(character, colorMode, CharacterColors) }}>
            <span className='vm-chara'>
                {character}:
                </span>&nbsp;{text}
        </p>
    );
}

function Action({ text, index }: { text: string, index: number }) {
    return (
        <h2 className="vm-action" key={index}>{text}</h2>
    );
}

function Transcript({ text, index }: { text: string, index: number }) {
    const { colorMode } = useContext(ColorModeContext);

    return (
        <div className="vm-transcript">
            <p key={index} style={{ color: 'var(--transcript-' + colorMode + ')' }}>{text}</p>
        </div>
    );
}