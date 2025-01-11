import { Episode as EpisodeType } from '@/types/Episodes';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ff2 from '@/assets/json/ff2.json';
import ff3 from '@/assets/json/ff3.json';
import EpisodeItem from '@/components/EpisodeItem/EpisodeItem';
import { Typography } from '@mui/material';

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
        navigate(`/${season}/${episode.episode_number}-${episode.file_name}`);
    }

    return (
        <main>
            <Typography variant='h1'>Season {season}</Typography>
            <ol>
                {episodes.map((episode) => (
                    <EpisodeItem key={episode.episode_number} episode={episode} handleEpisodeClick={handleEpisodeClick} />
                ))}
            </ol>
        </main>
    );
}