import { Typography, Button, Stack } from '@mui/material';

export default function Home() {
    return (
        <main>
            <Typography variant='h1'>Home</Typography>
            <Stack direction="row" spacing={2}>
                <Button variant='contained' color='ff2' href='/ff2' size="large">
                    Read FF2
                </Button>
                <Button variant='contained' color='ff3' href='/ff3' size="large">
                    Read FF3
                </Button>
            </Stack>
        </main>
    );
}
