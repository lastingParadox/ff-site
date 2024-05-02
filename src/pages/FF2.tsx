import StoryBlock from "@/components/StoryBlock/StoryBlock";
import { Episode as EpisodeType } from "@/types/Episodes";
import { useEffect, useState } from "react";
import {
    CircularProgress,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import TitleList from "@/assets/json/archives/ff2/titleList.json";
import { useNavigate, useParams } from "react-router-dom";

export default function FF2() {
    const { episode: episodeParam } = useParams();
    const navigate = useNavigate();
    const [episodeLoading, setEpisodeLoading] = useState(true);
    const [episode, setEpisode] = useState<EpisodeType>();

    useEffect(() => {
        const fetchEpisode = async () => {
            setEpisodeLoading(true);
            setEpisode(undefined);
            try {
                const response = await import(
                    `@/assets/json/archives/ff2/${episodeParam}.json`
                );
                setEpisode(response);
            } catch {
                console.error("Error fetching episode.");
            } finally {
                setEpisodeLoading(false);
            }
        };
        fetchEpisode();
    }, [episodeParam]);

    const handleSelectChange = (event: SelectChangeEvent) => {
        setEpisodeLoading(true);
        navigate(`/ff2/${event.target.value}`);
    };

    if (episodeLoading) {
        return (
            <div
                style={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    margin: "24px auto",
                }}
            >
                <Typography variant="h2">Loading...</Typography>{" "}
                <CircularProgress />
            </div>
        );
    }

    return (
        <div
            style={{
                width: "70%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                margin: "24px auto",
            }}
        >
            {episode?.blocks && episode?.blocks.length !== 0 && (
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2" align="left">
                            {episode?.title}
                        </Typography>
                        <Select
                            onChange={(event) => handleSelectChange(event)}
                            value={episodeParam}
                        >
                            {TitleList.map((title, index) => (
                                <MenuItem key={title.param} value={title.param}>
                                    {index + 1}.&nbsp;{title.display}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <Typography variant="h6" align="left">
                        {episode?.short_desc}
                    </Typography>
                    {episode.blocks?.map((block, index) => (
                        <StoryBlock
                            key={`${block.player}-${index}-${block.date}-block`}
                            block={block}
                        />
                    ))}
                </>
            )}
            {episode && (!episode.blocks || episode.blocks.length === 0) && (
                <Typography variant="h2">No content found.</Typography>
            )}
        </div>
    );
}
