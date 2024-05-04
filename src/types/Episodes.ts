export type Episode = {
    title: string;
    episode_number: number;
    short_desc: string;
    blocks: StoryBlock[];
    commentaries: Commentary[];
};

export type StoryBlock = {
    player: string;
    character: string | null;
    content: string[];
    date: string;
    quotes: number[] | null;
    commands: number[] | null;
    actions: number[] | null;
    other: number[] | null;
};

export type Commentary = {
    message_id: number;
    user_id: string;
    content: string;
}