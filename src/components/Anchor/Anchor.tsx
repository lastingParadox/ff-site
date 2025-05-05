import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import styles from './anchor.module.scss';

export default function Anchor({ isHovering, id }: { isHovering: boolean, id: number }): JSX.Element {
    const [open, setOpen] = useState(false);

    return (
        <Tooltip
            PopperProps={{
                disablePortal: true,
            }}
            onClose={() => setOpen(false)}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title='Copied to clipboard!'
            placement='top'
            arrow
        >
            <div
                className={`${styles.anchor} ${isHovering ? styles.hover : ''}`}
                style={{ flexGrow: 1 }}
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href.split('?')[0] + '?line=' + id.toString());
                    setOpen(true);
                    setTimeout(() => setOpen(false), 1000);
                }}
            >
                <ContentPasteIcon fontSize="large" />
            </div>
        </Tooltip>
    )
}