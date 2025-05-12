import React, { useMemo } from 'react';
import { useWindowDimensions, useInterval } from '@/utils/hooks';
import { Box } from '@mui/material';

export default function Orbit({ children }: { children: React.ReactNode[] }): JSX.Element {
    const { width, height }: { width: number, height: number } = useWindowDimensions();
    const RADIUS: number = Math.min(width, height) * 0.25;
    const ARC_LENGTH: number = 2 * Math.PI;
    const ITEM_SIZE: number = 80;
    const ORBITAL_PERIOD_IN_SECONDS: number = 1600;
    
    const [tick, setTick] = React.useState(1);
    const [animate, setAnimate] = React.useState(true);

    const formula = useMemo(
        () => (index: number, offset: number, trigFunc: (x: number) => number) =>
            trigFunc(ARC_LENGTH * (index / children.length) + (tick * ARC_LENGTH) / ORBITAL_PERIOD_IN_SECONDS) *
                RADIUS +
            offset -
            ITEM_SIZE / 2,
        [tick, width, RADIUS, ITEM_SIZE, ARC_LENGTH, children.length]
    );

    useInterval(() => {
        return;
        setTick(prevTick => {
            return prevTick + 1;
        });
    }, 40)

    return (
        <Box className="orbit" sx={{ width: RADIUS * 2, height: RADIUS * 2 }} onMouseEnter={() => setAnimate(false)} onMouseLeave={() => setAnimate(true)}>
            {children.map((item, index) => (
                <Box key={index} className="orbit-item" sx={{
                    position: 'absolute',
                    left: formula(index, width/2, Math.cos) + 'px',
                    top: formula(index, height/2, Math.sin) + 'px',
                }}>
                    {item}
                </Box>
            ))}
        </Box>
    )
};