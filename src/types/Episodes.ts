export type Episode = {
    title: string;
    episode_number: number;
    short_desc: string;
    blocks: StoryBlock[];
    commentaries: Commentary[];
    file_name?: string;
};

export type StoryBlock = {
    player: string;
    character: string | null;
    content: (GeneralContent | EmbedContent)[];
    date: string;
};

export type GeneralContent = {
    type: 'quote' | 'bot_response' | 'command' | 'action' | 'other';
    text: string;
};

export type EmbedContent = {
    type: 'embed';
    embed: {
        title?: string;
        description: string[];
        footer?: string;
    };
};

export type Commentary = {
    message_id: number;
    user_id: string;
    content: string;
};
