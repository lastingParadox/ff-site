import { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper } from '@mui/material';
import utils from '@/utils/convert/convert-utils.ts'; // Adjust import as per your actual file structure

function Convert() {
    // State for GU to Earth form
    const [guys, setGuys] = useState(0);
    const [semesters, setSemesters] = useState(0);
    const [equinoxes, setEquinoxes] = useState(0);
    const [periods, setPeriods] = useState(0);
    const [unions, setUnions] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);
    const [earthTime, setEarthTime] = useState('');

    // State for Earth to GU form
    const [earthYear, setEarthYear] = useState(0);
    const [earthMonth, setEarthMonth] = useState(0);
    const [earthDay, setEarthDay] = useState(0);
    const [earthHour, setEarthHour] = useState(0);
    const [earthMinute, setEarthMinute] = useState(0);
    const [earthSecond, setEarthSecond] = useState(0);
    const [earthMillisecond, setEarthMillisecond] = useState(0);
    const [guTime, setGuTime] = useState('');

    // Function to handle GU to Earth conversion
    const convertGuToEarth = () => {
        const result = utils.guToEarth(guys, semesters, equinoxes, periods, unions, seconds, milliseconds);
        setEarthTime(
            `Years: ${result[0]}, Months: ${result[1]}, Days: ${result[2]}, Hours: ${result[3]}, Minutes: ${result[4]}, Seconds: ${result[5]}, Milliseconds: ${result[6]}`
        );
    };

    // Function to handle Earth to GU conversion
    const convertEarthToGU = () => {
        const result = utils.earthToGU(
            earthYear,
            earthMonth,
            earthDay,
            earthHour,
            earthMinute,
            earthSecond,
            earthMillisecond
        );
        setGuTime(
            `GU Years: ${result[0]}, Semesters: ${result[1]}, Equinoxes: ${result[2]}, Periods: ${result[3]}, Unions: ${result[4]}, Duons: ${result[5]}, Trions: ${result[6]}`
        );
    };

    // TODO: Programmicatically generate the form fields and handle the conversion logic
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
                            type='number'
                            value={guys}
                            onChange={(e) => setGuys(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Semesters'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={semesters}
                            onChange={(e) => setSemesters(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Equinoxes'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={equinoxes}
                            onChange={(e) => setEquinoxes(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Periods'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={periods}
                            onChange={(e) => setPeriods(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Unions'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={unions}
                            onChange={(e) => setUnions(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Duons'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={seconds}
                            onChange={(e) => setSeconds(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Trions'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={milliseconds}
                            onChange={(e) => setMilliseconds(parseFloat(e.target.value))}
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
                            type='number'
                            value={earthYear}
                            onChange={(e) => setEarthYear(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Month'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={earthMonth}
                            onChange={(e) => setEarthMonth(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Day'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={earthDay}
                            onChange={(e) => setEarthDay(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Hour'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={earthHour}
                            onChange={(e) => setEarthHour(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Minute'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={earthMinute}
                            onChange={(e) => setEarthMinute(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Second'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={earthSecond}
                            onChange={(e) => setEarthSecond(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Millisecond'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={earthMillisecond}
                            onChange={(e) => setEarthMillisecond(parseFloat(e.target.value))}
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

export default Convert;
