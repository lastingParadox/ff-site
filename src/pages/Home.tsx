import { Box, Typography } from '@mui/material';
import Orbit from '@/components/Orbit/Orbit';
import PixelArtWithOutline from '@/components/PixelArtWithOutline/PixelArtWithOutline';

export default function Home() {
    return (
        <main id="home-page">
            <Typography variant='h1' align='center' classes='title'>Welcome to Vortox</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Orbit>
                    <PixelArtWithOutline characterImg="emmett" />
                    <PixelArtWithOutline characterImg="garrick" />
                    <PixelArtWithOutline characterImg="seth" />
                    <PixelArtWithOutline characterImg="sanya" />
                    <PixelArtWithOutline characterImg="chomsky" />
                    <PixelArtWithOutline characterImg="asier" />
                    <PixelArtWithOutline characterImg="matthias" />
                    <PixelArtWithOutline characterImg="rawley" />
                    <PixelArtWithOutline characterImg="ff8ball" />
                </Orbit>
            </Box>
        </main>
    );
}
