import { Avatar, CardHeader, Typography } from "@mui/material";
import Card from "@mui/material/Card/Card";
import CardContent from "@mui/material/CardContent/CardContent";
import CharacterColors from "@/assets/json/characterColors.json";
import { StoryBlock as Block } from "@/types/StoryBlocks";
/*
    This component is used to display a card with a story block.
    A story block consists of an avatar of the character, the name of the character, and stylized text.
    Quotes, Commands, Actions, and Other are a list of indexes that correspond to the content array.
    Each index is used to style the text differently depending on the type of content.
    Use MUI's Card component to display the story block and Avatar component to display the character's avatar.
*/

const getCharacterAvatar = (character: string) => {
    const color =
        CharacterColors[character as keyof typeof CharacterColors] ||
        stringToColor(character);
    return {
        sx: { backgroundColor: color },
        children: character[0].toUpperCase(),
    };
};

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export default function StoryBlock({ block }: { block: Block }) {
    const getCorrectText = (text: string, index: number) => {
        const styleDict = {
            quotes: {},
            commands: { fontWeight: "bold" },
            actions: { fontStyle: "italic" },
            other: {},
        };

        const styleObj = block.quotes?.includes(index)
            ? styleDict.quotes
            : block.commands?.includes(index)
            ? styleDict.commands
            : block.actions?.includes(index)
            ? styleDict.actions
            : styleDict.other;

        const variant = block.actions?.includes(index) ? "body2" : "body1";

        return (
            <Typography
                variant={variant}
                style={styleObj}
                key={`${block.character}-${index}`}
            >
                {text}
            </Typography>
        );
    };

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar
                        {...getCharacterAvatar(block.character || block.player)}
                    />
                }
                title={block.character || block.player}
                titleTypographyProps={{ sx: { fontSize: "1rem" } }}
                subheader={block.date}
                subheaderTypographyProps={{ sx: { fontStyle: "italic" } }}
            />
            <CardContent>
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                    {block.content.map((text, index) =>
                        getCorrectText(text, index)
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
