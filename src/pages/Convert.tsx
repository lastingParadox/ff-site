import { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper, InputAdornment } from '@mui/material';
import utils from '@/utils/convert/convert-utils.ts';

function Convert() {
    // State for GU to Earth form
    const [guys, setGuys] = useState(0);
    const [semesters, setSemesters] = useState(1);
    const [equinoxes, setEquinoxes] = useState(1);
    const [periods, setPeriods] = useState(0);
    const [unions, setUnions] = useState(0);
    const [duons, setDuons] = useState(0);
    const [trions, setTrions] = useState(0);
    const [earthTime, setEarthTime] = useState<string>('');

    // State for Earth to GU form
    const [earthYear, setEarthYear] = useState(1);
    const [earthMonth, setEarthMonth] = useState(1);
    const [earthDay, setEarthDay] = useState(1);
    const [earthHour, setEarthHour] = useState(0);
    const [earthMinute, setEarthMinute] = useState(0);
    const [earthSecond, setEarthSecond] = useState(0);
    const [earthMillisecond, setEarthMillisecond] = useState(0);
    const [guTime, setGuTime] = useState<string>('');

    // Function to handle GU to Earth conversion
    const convertGuToEarth = () => {
        if (utils.validateGU(semesters, equinoxes, periods, unions, duons, trions) === false) {
            setEarthTime('Invalid input');
            return;
        }
        const result = utils.guToEarth(guys, semesters, equinoxes, periods, unions, duons, trions);
        setEarthTime(
            `Years: ${result[0]}, Months: ${result[1]}, Days: ${result[2]}, Hours: ${result[3]}, Minutes: ${result[4]}, Seconds: ${result[5]}, Milliseconds: ${result[6]}`
        );
    };

    // Function to handle Earth to GU conversion
    const convertEarthToGU = () => {
        if (utils.validateEarth(earthYear, earthMonth, earthDay, earthHour, earthMinute, earthSecond, earthMillisecond) === false) {
            setGuTime('Invalid input');
            return;
        }
        const result = utils.earthToGU(earthYear, earthMonth, earthDay, earthHour, earthMinute, earthSecond, earthMillisecond);
        setGuTime(
            // We REALLY need to figure out how to display GU dates and times
            // Eq of Sem, GUY is fine for dates, but displaying times backwards is unreadable
            // Imagine: 850.28:54:10
            // That's absurd. It's unintuitive which one is the hour, minute, second, etc.
            `GU Years: ${result[0]}, Semesters: ${result[1]}, Equinoxes: ${result[2]}, Periods: ${result[3]}, Unions: ${result[4]}, Duons: ${result[5]}, Trions: ${result[6]}`
        );
    };

    // TODO: Programmicatically generate the form fields and handle the conversion logic
    return (
        <main>
            <Typography variant='h1' sx={{ mb: 4 }}>
                GU Time Conversion
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h6'>Convert GU to Earth Time</Typography>
                        <TextField
                            label='GUY'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={guys}
                            // InputProps={{
                            //     'endAdornment': <InputAdornment position="end">GUYs</InputAdornment>
                            // }}
                            onChange={(e) => setGuys(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Semester'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={semesters}
                            onChange={(e) => setSemesters(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Equinox'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={equinoxes}
                            onChange={(e) => setEquinoxes(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Period (hour)'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={periods}
                            onChange={(e) => setPeriods(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Union (minute)'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={unions}
                            onChange={(e) => setUnions(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Duon (second)'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={duons}
                            onChange={(e) => setDuons(parseFloat(e.target.value))}
                        />
                        <TextField
                            label='Trion (millisecond)'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={trions}
                            onChange={(e) => setTrions(parseFloat(e.target.value))}
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
        </main>
    );
}

export default Convert;
