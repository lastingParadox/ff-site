import { Avatar, Typography } from '@mui/material';
import Card from '@mui/material/Card/Card';
import CharacterColors from '@/assets/json/characterColors.json';
import { StoryBlock as Block } from '@/types/Episodes';
import React, { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { ColorModeContext } from '@/pages/RootLayout';
import styles from './storyblock.module.scss';
/*
    This component is used to display a card with a story block.
    A story block consists of an avatar of the character, the name of the character, and stylized text.
    Quotes, Commands, Actions, and Other are a list of indexes that correspond to the content array.
    Each index is used to style the text differently depending on the type of content.
    Use MUI's Card component to display the story block and Avatar component to display the character's avatar.
*/

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    /* eslint-enable no-bitwise */
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function getCharacterColor(character: string, colorMode: 'light' | 'dark') {
    if (!character) {
        return colorMode == 'light' ? '#000000' : '#FFFFFF';
    } else if (!CharacterColors[colorMode][character as keyof typeof CharacterColors.light]) {
        return stringToColor(character);
    } else {
        return CharacterColors[colorMode][character as keyof typeof CharacterColors.light];
    }
}

export default function StoryBlock({ block, id }: { block: Block; id: number }): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState<string>();
    const { colorMode } = useContext(ColorModeContext);
    const chosenCharacter = useMemo(() => block.character || block.player, [block.character, block.player]);
    const characterColor = useMemo(() => getCharacterColor(chosenCharacter, colorMode), [chosenCharacter, colorMode]);

    // We use dynamic imports to load the avatar image of the character, considering that the images are named after the character's name.
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const fileName = block.player === 'FF 8 Ball' ? '8ball' : chosenCharacter;
                const response = await import(`../../assets/images/avatars/${fileName?.toLowerCase()}.png`);
                setAvatar(response.default);
            } catch {
                setAvatar('');
            } finally {
                setLoading(false);
            }
        };
        fetchAvatar();
    }, [block.player, chosenCharacter]);

    // Get the correct style for the text based on the type of content.
    const getCorrectText = useCallback(
        (text: string, index: number) => {
            const styleDict: { [name: string]: React.CSSProperties } = {
                quotes: {},
                commands: {
                    border: `1px solid ${characterColor}`,
                    borderRadius: 1,
                    color: `${characterColor}`,
                    padding: '4px 8px',
                    backgroundColor: `${characterColor}20`,
                    fontFamily: 'monospace',
                    fontWeight: 400,
                },
                actions: { fontStyle: 'italic' },
                other: {},
            };

            const styleObj = block.quotes?.includes(index)
                ? styleDict.quotes
                : block.commands?.includes(index)
                ? styleDict.commands
                : block.actions?.includes(index)
                ? styleDict.actions
                : styleDict.other;

            const variant = block.actions?.includes(index) ? 'body2' : 'body1';

            return (
                <Typography
                    variant={variant}
                    sx={{ ...styleObj, width: 'fit-content' }}
                    key={`${chosenCharacter}-${index}`}
                >
                    {text}
                </Typography>
            );
        },
        [block.actions, block.commands, block.quotes, characterColor, chosenCharacter]
    );

    // Get the character's avatar based on the character's name.
    const getCharacterAvatar = useCallback(
        (character: string) => {
            const color = loading ? 'transparent' : characterColor;
            return {
                sx: {
                    backgroundColor: avatar ? undefined : color,
                    height: 56,
                    width: 56,
                    marginTop: 1,
                },
                children: loading ? '' : character[0].toUpperCase(),
            };
        },
        [avatar, characterColor, loading]
    );

    return (
        <div id={`${id}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%' }}>
                <Avatar
                    {...getCharacterAvatar(chosenCharacter)}
                    src={avatar}
                    variant={avatar ? 'square' : 'circular'}
                    className={styles.avatar}
                    style={{
                        color: characterColor,
                        borderColor: characterColor,
                        backgroundColor: characterColor + 40,
                    }}
                />
                <Card sx={{ flexGrow: 1, padding: 2 }}>
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            marginBottom: '8px',
                        }}
                    >
                        <Typography sx={{ fontWeight: 600 }}>{chosenCharacter}</Typography>
                        <Typography
                            sx={{
                                color: '#AAAAAA',
                                fontSize: '0.9rem',
                                fontWeight: 200,
                                fontStyle: 'italic',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        {block.content.map((text, index) => getCorrectText(text, index))}
                    </div>
                </Card>
            </div>
            <a href={`#${id}`} className={styles.anchor} style={{ flexGrow: 1 }}>
                #
            </a>
        </div>
    );
}
