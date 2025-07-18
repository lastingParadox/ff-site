import { Avatar, Typography, Tooltip, Box } from '@mui/material';
import Card from '@mui/material/Card/Card';
import CharacterColors from '@/assets/json/characterColors.json';
import { StoryBlock as Block, EmbedContent, GeneralContent } from '@/types/Episodes';
import { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { ColorModeContext } from '@/pages/RootLayout';
import styles from './storyblock.module.scss';
import PixelArtWithOutline from '../PixelArtWithOutline/PixelArtWithOutline';
import { useSearchParams } from 'react-router-dom';
import { getCharacterColor } from '@/utils/colors';
import Anchor from '../Anchor/Anchor';
import { useAnchor } from '../Anchor/AnchorContext';
/*
    This component is used to display a card with a story block.
    A story block consists of an avatar of the character, the name of the character, and stylized text.
    Quotes, Commands, Actions, and Other are a list of indexes that correspond to the content array.
    Each index is used to style the text differently depending on the type of content.
    Use MUI's Card component to display the story block and Avatar component to display the character's avatar.
*/

export default function StoryBlock({ block, id }: { block: Block; id: number }): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState<string>();
    const [hovering, setHovering] = useState(false);
    const { lineParam, query, setQuery } = useAnchor();
    const { colorMode } = useContext(ColorModeContext);
    const chosenCharacter = useMemo(() => block.character || block.player, [block.character, block.player]);
    const characterColor = useMemo(
        () => (loading ? 'transparent' : getCharacterColor(chosenCharacter, colorMode, CharacterColors)),
        [chosenCharacter, colorMode, loading]
    );
    const characterShorthand = useMemo(() => chosenCharacter.toLowerCase().replaceAll(/\s/g, ''), [chosenCharacter]);

    // We use dynamic imports to load the avatar image of the character, considering that the images are named after the character's name.
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await import(
                    `../../assets/images/avatars/${characterShorthand}.png`
                );
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
    const getContentComponent = useCallback(
        (content: GeneralContent | EmbedContent, index: number) => {
            // TODO: Add support for embeds
            if (content.type === 'embed') {
                return (
                    <div style={{ backgroundColor: 'rgba(0,0,0,.2)', padding: '8px' }}>
                        {content.embed.description.map((text, i) => (
                            <Other key={index + i} text={text} />
                        ))}
                    </div>
                );
            }

            switch (content.type) {
                case 'quote':
                    return <Quote key={index} text={content.text} />;
                case 'command':
                    return <Command key={index} text={content.text} color={characterColor} />;
                case 'action':
                    return <Action key={index} text={content.text} />;
                default:
                    return <Other key={index} text={content.text} />;
            }
        },
        [characterColor]
    );

    // Get the character's avatar based on the character's name.
    const getCharacterAvatar = useCallback(
        (character: string) => {
            return {
                sx: {
                    color: characterColor,
                    borderColor: characterColor,
                    backgroundColor: characterColor + 40,
                    height: 56,
                    width: 56,
                    marginTop: 1,
                },
                children: loading ? '' : character[0].toUpperCase(),
            };
        },
        [characterColor, loading]
    );

    useEffect(() => {
        if (lineParam) {
            setQuery(parseInt(lineParam));
        }
    }, [lineParam]);

    return (
        <div
            id={`${id}`}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1 }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%' }}>
                {!avatar ? (
                    <Avatar
                        {...getCharacterAvatar(chosenCharacter)}
                        src={avatar}
                        variant={avatar ? 'square' : 'circular'}
                        className={styles.avatar}
                        style={{}}
                    />
                ) : (
                    <div className={styles.avatarDiv}>
                        <PixelArtWithOutline
                            characterImg={characterShorthand}
                            color={characterColor}
                            zoom={4}
                        />
                    </div>
                )}
                <Card
                    sx={{ flexGrow: 1, padding: 2, overflowWrap: 'anywhere', backgroundColor: characterColor + 10 }}
                    style={
                        query == -1 ? {} : query === id ? { boxShadow: `0px 0px 4px 4px ${characterColor + 80}` } : {}
                    }
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            marginBottom: '8px',
                        }}
                    >
                        <Typography sx={{ fontWeight: 600, color: characterColor }}>{chosenCharacter}</Typography>
                        <Typography
                            sx={{
                                color: '#AAAAAA',
                                fontSize: '0.9rem',
                                fontWeight: 200,
                                fontStyle: 'italic',
                            }}
                        >
                            {block.date}
                        </Typography>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        {block.content.map((content, index) => getContentComponent(content, index))}
                    </div>
                </Card>
            </div>
            <Anchor isHovering={hovering} id={id} />
        </div>
    );
}

const Quote = ({ text }: { text: string }) => {
    return (
        <Typography variant='body1' sx={{ width: '100%' }}>
            {text}
        </Typography>
    );
};

const Command = ({ text, color }: { text: string; color: string }) => {
    return (
        <Typography
            variant='body1'
            sx={{
                border: `1px solid ${color}`,
                borderRadius: 1,
                color: `${color}`,
                padding: '4px 8px',
                backgroundColor: `${color}20`,
                fontFamily: 'monospace',
                fontWeight: 400,
                width: '100%',
            }}
        >
            {text}
        </Typography>
    );
};

const Action = ({ text }: { text: string }) => {
    return (
        <Typography variant='body2' sx={{ fontStyle: 'italic', width: '100%' }}>
            {text}
        </Typography>
    );
};

const Other = ({ text }: { text: string }) => {
    return (
        <Typography variant='body1' sx={{ width: '100%' }}>
            {text}
        </Typography>
    );
};
