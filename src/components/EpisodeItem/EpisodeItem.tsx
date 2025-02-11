import { Box, Typography } from '@mui/material';
import { Episode as EpisodeType } from '@/types/Episodes';
import styles from './episode.module.scss';
import { palette } from '@mui/system';

// export default function StoryBlock({ block, id }: { block: Block; id: number }): JSX.Element {
export default function EpisodeItem({
    episode,
    handleEpisodeClick,
}: {
    episode: EpisodeType;
    handleEpisodeClick: (episode: EpisodeType) => void;
}): JSX.Element {
    return (
        <li key={episode.episode_number} className={styles.episode}>
            <Box
                className={styles['episode-item']}
                sx={{
                    backgroundColor: 'action.hover',
                    '&:hover': {
                        backgroundColor: 'action.selected',
                    },
                }}
                onClick={() => handleEpisodeClick(episode)}
            >
                <Typography variant='h3' className={styles.title} sx={{ color: 'text.primary' }}>
                    {episode.title}
                </Typography>
                <Typography variant='subtitle1' className={styles.description} sx={{ color: 'text.secondary' }}>
                    {episode.short_desc}
                </Typography>
            </Box>
        </li>
    );
}
