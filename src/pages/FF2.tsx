import StoryBlock from "@/components/StoryBlock/StoryBlock";
import EpisodeBlockJSON from "@/assets/json/archives/ff2/fragile-beginnings.json";
import { useState } from "react";
import { StoryBlock as StoryBlockType } from "@/types/StoryBlocks";

export default function FF2() {
    const [episodeBlocks] = useState<StoryBlockType[]>(EpisodeBlockJSON.blocks);

    return (
        <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
            <div
                style={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    margin: 24,
                }}
            >
                {episodeBlocks.map((block) => (
                    <StoryBlock
                        key={`${block.player}-${block.date}-block`}
                        block={block}
                    />
                ))}
            </div>
        </div>
    );
}
