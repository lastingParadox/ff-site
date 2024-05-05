import { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper } from '@mui/material';
import utils from './convert-utils.ts'; // Adjust import as per your actual file structure

function UnitConverter() {
    // State for GU to Earth form
    const [guys, setGuys] = useState('');
    const [semesters, setSemesters] = useState('');
    const [equinoxes, setEquinoxes] = useState('');
    const [periods, setPeriods] = useState('');
    const [unions, setUnions] = useState('');
    const [seconds, setSeconds] = useState('');
    const [milliseconds, setMilliseconds] = useState('');
    const [earthTime, setEarthTime] = useState('');

    // State for Earth to GU form
    const [earthYear, setEarthYear] = useState('');
    const [earthMonth, setEarthMonth] = useState('');
    const [earthDay, setEarthDay] = useState('');
    const [earthHour, setEarthHour] = useState('');
    const [earthMinute, setEarthMinute] = useState('');
    const [earthSecond, setEarthSecond] = useState('');
    const [earthMillisecond, setEarthMillisecond] = useState('');
    const [guTime, setGuTime] = useState('');

    // Function to handle GU to Earth conversion
    const convertGuToEarth = () => {
        const result = utils.guToEarth(
            parseInt(guys),
            parseInt(semesters),
            parseInt(equinoxes),
            parseInt(periods),
            parseInt(unions),
            parseInt(seconds),
            parseInt(milliseconds)
        );
        setEarthTime(
            `Year: ${result[0]}, Month: ${result[1]}, Day: ${result[2]}, Hour: ${result[3]}, Minute: ${result[4]}, Second: ${result[5]}, Millisecond: ${result[6]}`
        );
    };

    // Function to handle Earth to GU conversion
    const convertEarthToGU = () => {
        const result = utils.earthToGU(
            parseInt(earthYear),
            parseInt(earthMonth),
            parseInt(earthDay),
            parseInt(earthHour),
            parseInt(earthMinute),
            parseInt(earthSecond),
            parseInt(earthMillisecond)
        );
        setGuTime(
            `GU Years: ${result[0]}, Semesters: ${result[1]}, Equinoxes: ${result[2]}, Periods: ${result[3]}, Unions: ${result[4]}, Duons: ${result[5]}, Trions: ${result[6]}`
        );
    };

    return (
        <Container
            maxWidth='lg'
            style={{
                width: '70%',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                margin: '24px auto',
            }}
        >
            <Typography variant='h2' sx={{ mb: 4 }}>
                GU Time Conversion
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h6'>Convert GU to Earth Time</Typography>
                        <TextField
                            label='GU Years'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={guys}
                            onChange={(e) => setGuys(e.target.value)}
                        />
                        <TextField
                            label='Semesters'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={semesters}
                            onChange={(e) => setSemesters(e.target.value)}
                        />
                        <TextField
                            label='Equinoxes'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={equinoxes}
                            onChange={(e) => setEquinoxes(e.target.value)}
                        />
                        <TextField
                            label='Periods'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={periods}
                            onChange={(e) => setPeriods(e.target.value)}
                        />
                        <TextField
                            label='Unions'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={unions}
                            onChange={(e) => setUnions(e.target.value)}
                        />
                        <TextField
                            label='Duons'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                        />
                        <TextField
                            label='Trions'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={milliseconds}
                            onChange={(e) => setMilliseconds(e.target.value)}
                        />
                        <Button variant='contained' color='primary' onClick={convertGuToEarth} sx={{ mt: 2 }}>
                            Convert
                        </Button>
                        {earthTime && <Typography sx={{ mt: 2 }}>{earthTime}</Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h6'>Convert Earth to GU Time</Typography>
                        <TextField
                            label='Year'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={earthYear}
                            onChange={(e) => setEarthYear(e.target.value)}
                        />
                        <TextField
                            label='Month'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={earthMonth}
                            onChange={(e) => setEarthMonth(e.target.value)}
                        />
                        <TextField
                            label='Day'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={earthDay}
                            onChange={(e) => setEarthDay(e.target.value)}
                        />
                        <TextField
                            label='Hour'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={earthHour}
                            onChange={(e) => setEarthHour(e.target.value)}
                        />
                        <TextField
                            label='Minute'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={earthMinute}
                            onChange={(e) => setEarthMinute(e.target.value)}
                        />
                        <TextField
                            label='Second'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={earthSecond}
                            onChange={(e) => setEarthSecond(e.target.value)}
                        />
                        <TextField
                            label='Millisecond'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            value={earthMillisecond}
                            onChange={(e) => setEarthMillisecond(e.target.value)}
                        />
                        <Button variant='contained' color='primary' onClick={convertEarthToGU} sx={{ mt: 2 }}>
                            Convert
                        </Button>
                        {guTime && <Typography sx={{ mt: 2 }}>{guTime}</Typography>}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default UnitConverter;
