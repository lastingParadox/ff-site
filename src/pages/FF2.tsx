import StoryBlock from '@/components/StoryBlock/StoryBlock';
import { Episode as EpisodeType } from '@/types/Episodes';
import { useEffect, useState } from 'react';
import { CircularProgress, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import TitleList from '@/assets/json/archives/ff2/titleList.json';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function FF2() {
    const { episode: episodeParam } = useParams();
    const navigate = useNavigate();
    const [episodeLoading, setEpisodeLoading] = useState(true);
    const [episode, setEpisode] = useState<EpisodeType>();
    const [loadedBlockNum, setLoadedBlockNum] = useState(50);

    useEffect(() => {
        const fetchEpisode = async () => {
            setEpisodeLoading(true);
            setEpisode(undefined);
            setLoadedBlockNum(50);
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
            }}
        >
            {episode?.blocks && episode?.blocks.length !== 0 && (
                <>
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
                            {TitleList.map((title) => (
                                <MenuItem key={title.param} value={title.param}>
                                    {title.display}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <Typography variant='h6' align='left'>
                        {episode?.short_desc}
                    </Typography>
                    {/* {episode.blocks?.map((block, index) => (
                        <StoryBlock
                            key={`${block.player}-${index}-${block.date}-block`}
                            block={block}
                        />
                    ))} */}
                    <StoryBlockInfiniteScroll
                        blocks={episode.blocks}
                        loadedBlockNum={loadedBlockNum}
                        setLoadedBlockNum={setLoadedBlockNum}
                    />
                </>
            )}
            {episode && (!episode.blocks || episode.blocks.length === 0) && (
                <Typography variant='h2'>No content found.</Typography>
            )}
        </div>
    );
}

// Create a component that has an InfiniteScroll component that wraps the StoryBlock components. Load in 50 story blocks at a time.
// Use the loadedBlockNum state to determine how many blocks to show.
const StoryBlockInfiniteScroll = ({
    blocks,
    loadedBlockNum,
    setLoadedBlockNum,
}: {
    blocks: EpisodeType['blocks'];
    loadedBlockNum: number;
    setLoadedBlockNum: (val: number) => void;
}) => {
    return (
        <InfiniteScroll
            dataLength={loadedBlockNum}
            next={() => setLoadedBlockNum(loadedBlockNum + 50)}
            hasMore={loadedBlockNum < blocks.length}
            loader={<CircularProgress />}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
            {blocks.slice(0, loadedBlockNum).map((block, index) => (
                <StoryBlock key={`${block.player}-${index}-${block.date}-block`} block={block} />
            ))}
        </InfiniteScroll>
    );
};
