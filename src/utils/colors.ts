export function stringToColor(string: string) {
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

export function getCharacterColor(character: string, colorMode: 'light' | 'dark', colors: { light: Record<string, string>, dark: Record<string, string> }): string {
    if (!character) {
        return colorMode == 'light' ? '#000000' : '#FFFFFF';
    } else if (!colors[colorMode][character as keyof typeof colors.light]) {
        return stringToColor(character);
    } else {
        return colors[colorMode][character as keyof typeof colors.light];
    }
}