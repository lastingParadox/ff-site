import { Episode as EpisodeType } from '@/types/Episodes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ff2 from '@/assets/json/ff2.json';
import EpisodeItem from '@/components/EpisodeItem/EpisodeItem';
import { Typography, IconButton } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

export default function Season({ season }: { season: string }) {
    const [episodes, setEpisodes] = useState<EpisodeType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        let seasonEpisodes: any[] = [];
        if (season === 'ff2') {
            for (const episode of ff2) {
                seasonEpisodes.push({ ...episode, commentaries: [] });
            }
        }
        setEpisodes(seasonEpisodes);
    }, [season]);

    function handleEpisodeClick(episode: EpisodeType) {
        navigate(`/archives/${season}/${episode.episode_number}-${episode.file_name}`);
    }

    return (
        <main className={season}>
            <Typography variant='h1'>
                <IconButton size='large' onClick={() => navigate(-1)} sx={{ marginLeft: 2 }}>
                    <KeyboardReturnIcon />
                </IconButton>
                Season {season}
            </Typography>
            <ol>
                {episodes.map((episode) => (
                    <EpisodeItem key={episode.episode_number} episode={episode} handleEpisodeClick={handleEpisodeClick} />
                ))}
            </ol>
        </main>
    );
}