import StoryBlock from '@/components/StoryBlock/StoryBlock';
import { Episode as EpisodeType } from '@/types/Episodes';
import CommentIcon from '@mui/icons-material/Comment';
import { CircularProgress, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { VList, VListHandle } from 'virtua';
import { useAnchor } from '@/components/Anchor/AnchorContext';

// Function to format a file name into a human-readable title
// Format: 1-fragile-beginnings.json -> Fragile Beginnings
// Filenames do not always have a single hyphen, so we need to account for that
// Sometimes they have zero hyphens, sometimes they have two
// Each word should be capitalized
function formatTitle(fileName: string): string {
    const words = fileName.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}

export default function ArchivePage() {
    const [episodeLoading, setEpisodeLoading] = useState(true);
    const [episode, setEpisode] = useState<EpisodeType>();
    const [episodeFiles, setEpisodeFiles] = useState<{ paramName: string; title: string; episodeNumber: number }[]>([]);
    const ref = useRef<VListHandle>(null);

    const { episode: episodeParam } = useParams();
    const { pathname } = useLocation();
    const season = useMemo(() => pathname.split('/')[2] as 'FF2 | FF3', [pathname]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const lineParam = useMemo(() => searchParams.get('line'), [searchParams]);

    const [allBlocksRendered, setAllBlocksRendered] = useState(false); // New state

    // I moved all the logic for scrolling to the anchor into the useEffect below
    // It waits for all blocks to be rendered before scrolling to the anchor
    // If it attempts to scroll before all blocks are rendered, it will NOT work
    const { scrollToAnchor } = useAnchor();
    useEffect(() => {
        if (allBlocksRendered && lineParam) {
            scrollToAnchor(lineParam);
        }
    }, [allBlocksRendered, lineParam]);
    const handleBlocksRendered = () => {
        setAllBlocksRendered(true); // Set flag when all blocks are rendered
    };

    // Fetch files
    useEffect(() => {
        if (!season) return;

        const files = import.meta.glob(`@/assets/json/archives/**/*.json`);

        // Grab all files in the current season
        // i.e., in @/assets/json/archives/FF2

        const getEpisodeTitle = async (file: string) => {
            try {
                const { title } = (await import(`@/assets/json/archives/${season}/${file}.json`)) as EpisodeType;
                return title;
            } catch {
                return '';
            }
        };

        const generateEpisodeFiles = async () => {
            const episodePromises = Object.keys(files)
                .filter((file) => file.includes(season))
                .map(async (file) => {
                    // Initial file name format: #-title.json
                    // Requested file name format: title
                    const initialFileName = file.split('/').pop() as string;
                    const regExMatch = initialFileName.match(/((\d+)-(.+)).json/);
                    const [paramName, episodeNumber] = regExMatch ? [regExMatch[1], parseInt(regExMatch[2])] : ['', 0];

                    // Convert param name to human-readable title
                    const title = await getEpisodeTitle(paramName);

                    return { paramName: paramName, title, episodeNumber };
                });

            const episodeFiles = await Promise.all(episodePromises);

            episodeFiles.sort((a, b) => a.episodeNumber - b.episodeNumber);

            setEpisodeFiles(episodeFiles);
        };

        generateEpisodeFiles();
    }, [season]);

    // Fetch episode data
    useEffect(() => {
        const fetchEpisode = async () => {
            setEpisodeLoading(true);
            setEpisode(undefined);
            try {
                const response = await import(`@/assets/json/archives/${season}/${episodeParam}.json`);
                setEpisode(response);
            } catch {
                console.error('Error fetching episode.');
                setEpisode(undefined);
            } finally {
                setEpisodeLoading(false);
            }
        };
        fetchEpisode();
    }, [episodeParam, season]);

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
        navigate(`/archives/${season}/${event.target.value}`);
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
        <main>
            {episode === undefined && <Typography variant='h2'>Episode not found.</Typography>}
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
                            <Typography variant='h1' align='left' sx={{ fontSize: '4rem' }}>
                                {episode?.title}
                            </Typography>
                            <Select onChange={(event) => handleSelectChange(event)} value={episodeParam}>
                                {episodeFiles?.map((title) => (
                                    <MenuItem key={title.paramName} value={title.paramName}>
                                        {title.episodeNumber}.&nbsp;{title.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <Typography variant='h6' align='left'>
                            {episode?.short_desc}
                        </Typography>
                    </div>
                    <StoryBlockInfiniteScroll
                        ref={ref}
                        blocks={episode.blocks}
                        commentaries={episode.commentaries}
                        onBlocksRendered={handleBlocksRendered} // Pass the callback to the component
                    />
                </div>
            )}
        </main>
    );
}

const StoryBlockInfiniteScroll = forwardRef(function StoryBlockInfiniteScroll(
    {
        blocks,
        commentaries,
        onBlocksRendered, // Accept the callback as a prop
    }: {
        blocks: EpisodeType['blocks'];
        commentaries: EpisodeType['commentaries'],
        onBlocksRendered: () => void; // Define the type for the callback
    },
    ref: React.ForwardedRef<VListHandle>
) {
    useEffect(() => {
        onBlocksRendered(); // Notify parent when blocks are rendered
    }, []);

    return (
        <div style={{ height: 700, padding: '10px 0' }}>
            {blocks.map((block, index) => (
                <div
                    key={`${block.player}-${index}-${block.date}-container`}
                    style={{ margin: '0 0 12px 0', display: 'flex', justifyContent: 'space-between' }}
                >
                    <StoryBlock key={`${block.player}-${index}-${block.date}-block`} block={block} id={index} />
                    <div style={{ minWidth: '40px', display: 'flex', alignItems: 'center' }}>
                        {commentaries &&
                            commentaries
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
                </div>
            ))}
        </div>
    );
});
