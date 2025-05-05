import { Typography, Box, Stack, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ArchivesList() {
    const items = [
        {
            id: 'ff1',
            title: 'Final Frontier 1',
        },
        {
            id: 'ff2',
            title: 'Final Frontier 2',
        },
        {
            id: 'ff3',
            title: 'Final Frontier 3',
        },
        {
            id: 'ff4',
            title: 'Final Frontier 4',
            img: 'blackhole.jpg',
        },
        {
            id: 'vm',
            title: 'Vortox Machina',
        },
    ]

    return (
        <Container id="home-page" role="main" maxWidth={false} sx={{ margin: '0 !important', padding: '0 !important', height: '100%' }}>
            <Stack direction="row" spacing={0} className='horizontal-list'>
                {items.map((item, index) => (
                    <ArchiveItem key={index} id={item.id} title={item.title} img={item.img} />
                ))}
            </Stack>
        </Container>
    );
}

function ArchiveItem({ id, title, img }: { id: string; title: string, img: string | undefined }) {
    const [hovering, setHovering] = useState(false);

    return (
        <Box key={id} className='horizontal-item' data-order={id}
            sx={(theme) => ({
                // @ts-ignore
                color: theme.palette[id as keyof typeof theme.palette]?.main || theme.palette.primary.main,
                '&:hover': {
                    // @ts-ignore
                    // color: theme.palette[id as keyof typeof theme.palette]?.light || theme.palette.primary.light,
                }
            })}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <Box className='item-image' sx={img ? {'--url': `url('src/assets/images/${img}')`} : undefined} />
            <NavLink to={`/archives/${id}`} />
            <Typography className='item-title'>
                {hovering ? title : id}
            </Typography>
        </Box>
    );
}
