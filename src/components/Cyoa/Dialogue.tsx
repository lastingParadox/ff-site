import './vm.scss';
import CharacterColors from '@/assets/json/characterColors.json';
import { getCharacterColor } from '@/utils/colors';
import { useContext } from 'react';
import { ColorModeContext } from '@/pages/RootLayout';

export default function Dialogue({ character, text, index }: { character: string; text: string; index: number }) {
    const { colorMode } = useContext(ColorModeContext);
    return (
        <p className='vm-dialogue' key={index} style={{ color: getCharacterColor(character, colorMode, CharacterColors) }}>
            <span className='vm-chara'>
                {character}:
                </span>&nbsp;{text}
        </p>
    );
}
