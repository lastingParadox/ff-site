import { KeyboardReturn } from "@mui/icons-material";
import { Typography, Box, Button } from "@mui/material";

export default function NotFound() {
    return (
        <main id="not-found-page">
            <Typography variant='h1' align='center' classes='title'>404 - Page Not Found</Typography>
            <Box component='figure' className='not-found-image-container'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box component='img'
                    className='not-found-image'
                    sx={{
                        height: 285,
                        width: 285,
                        imageRendering: 'pixelated',
                    }}
                    alt="Emmett Tawfeek frowning and looking uncomfortable"
                    src="https://booru.retri.space/_images/9ba1671830f52c3fc1d7bd204e90740e/678%20-%20character%3Aemmett_tawfeek%20frowning%20fur%20horns%20species%3Asquoatling%20tired%20uncomfortable.png"
                />
                <Typography variant='subtitle1' component='figcaption'>Emmett can't find the page you're looking for.</Typography>
            <Button variant='contained' color='primary' size='large' href='/' sx={{ marginTop: 1 }}>
                <KeyboardReturn sx={{ marginRight: 1 }} />
                Go back home
            </Button>
            </Box>
        </main>
    );
}