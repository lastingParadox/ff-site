import StoryBlock from '@/components/StoryBlock/StoryBlock';
import { Episode as EpisodeType } from '@/types/Episodes';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { CircularProgress, MenuItem, Select, SelectChangeEvent, Typography, Tooltip } from '@mui/material';
import TitleList from '@/assets/json/archives/ff2/titleList.json';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { VList, VListHandle } from 'virtua';
import CommentIcon from '@mui/icons-material/Comment';

export default function FF2() {
    const { episode: episodeParam } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [episodeLoading, setEpisodeLoading] = useState(true);
    const [episode, setEpisode] = useState<EpisodeType>();
    const ref = useRef<VListHandle>(null);
    const lineParam = useMemo(() => searchParams.get('line'), [searchParams]);

    useEffect(() => {
        const fetchEpisode = async () => {
            setEpisodeLoading(true);
            setEpisode(undefined);
            try {
                const response = await import(`@/assets/json/archives/ff2/${episodeParam}.json`);
                setEpisode(response);
            } catch {
                console.error('Error fetching episode.');
            } finally {
                setEpisodeLoading(false);
            }
        };
        fetchEpisode();
    }, [episodeParam]);

    // Unsure if this useEffect is necessary
    useEffect(() => {
        if (episode && episode.blocks?.length > 0 && ref.current && lineParam) {
            const line = parseInt(lineParam);
            console.log('scrolling to line', line);
            ref.current.scrollToIndex(line);
        }
    }, [episode, lineParam]);

    const handleSelectChange = (event: SelectChangeEvent) => {
        setEpisodeLoading(true);
        navigate(`/ff2/${event.target.value}`);
    };

    if (episodeLoading) {
        return (
            <div
                style={{
                    width: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    margin: '24px auto',
                }}
            >
                <Typography variant='h2'>Loading...</Typography> <CircularProgress />
            </div>
        );
    }

    return (
        <div
            style={{
                width: '70%',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                margin: '24px auto',
                height: '700px',
            }}
        >
            {episode?.blocks && episode?.blocks.length !== 0 && (
                <div style={{ height: '100%' }}>
                    <div style={{ marginBottom: 12 }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h2' align='left'>
                                {episode?.title}
                            </Typography>
                            <Select onChange={(event) => handleSelectChange(event)} value={episodeParam}>
                                {TitleList.map((title, index) => (
                                    <MenuItem key={title.param} value={title.param}>
                                        {index + 1}.&nbsp;{title.display}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <Typography variant='h6' align='left'>
                            {episode?.short_desc}
                        </Typography>
                    </div>
                    <StoryBlockInfiniteScroll ref={ref} blocks={episode.blocks} commentaries={episode.commentaries} />
                </div>
            )}
            {episode && (!episode.blocks || episode.blocks.length === 0) && (
                <Typography variant='h2'>No content found.</Typography>
            )}
        </div>
    );
}

const StoryBlockInfiniteScroll = forwardRef(function StoryBlockInfiniteScroll(
    { blocks, commentaries }: { blocks: EpisodeType['blocks']; commentaries: EpisodeType['commentaries'] },
    ref: React.ForwardedRef<VListHandle>
) {
    return (
        <VList ref={ref} style={{ height: 700 }}>
            {blocks.map((block, index) => (
                <div
                    key={`${block.player}-${index}-${block.date}-container`}
                    style={{ margin: '0 0 12px 0', display: 'flex', justifyContent: 'space-between' }}
                >
                    <StoryBlock key={`${block.player}-${index}-${block.date}-block`} block={block} id={index} />
                    {commentaries
                        .filter((commentary) => commentary.message_id === index)
                        .map((commentary, commentIndex) => (
                            <Tooltip
                                title={
                                    <>
                                        {/* The ID here will, eventually, reference an actual username */}
                                        <Typography style={{ fontWeight: 'bold' }}>
                                            {commentary.user_id} says:
                                        </Typography>
                                        <Typography>{commentary.content}</Typography>
                                    </>
                                }
                                placement='right'
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        marginRight: '1em',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CommentIcon />
                                </div>
                            </Tooltip>
                        ))}
                </div>
            ))}
        </VList>
    );
});
