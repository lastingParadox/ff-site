import { Typography } from '@mui/material';
import { Episode as EpisodeType } from '@/types/Episodes';
import styles from './episode.module.scss';

// export default function StoryBlock({ block, id }: { block: Block; id: number }): JSX.Element {
export default function EpisodeItem(
    { episode, handleEpisodeClick }:
    { episode: EpisodeType, handleEpisodeClick: (episode: EpisodeType) => void }
): JSX.Element {
    return (
        <li key={episode.episode_number} className={styles.episode}>
            <div className={styles['episode-item']} onClick={() => handleEpisodeClick(episode)}>
                <Typography variant='h3' className={styles.title}>
                    {episode.title}
                </Typography>
                <Typography variant='subtitle1' className={styles.description}>
                    {episode.short_desc}
                </Typography>
            </div>
        </li>
    );
}
