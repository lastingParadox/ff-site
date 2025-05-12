import React, { useCallback, useRef } from 'react';
import { useWindowDimensions } from '@/utils/hooks';
import { Box } from '@mui/material';

export default function Orbit({ children }: { children: React.ReactNode[] }): JSX.Element {
    const { width, height }: { width: number, height: number } = useWindowDimensions();
    const RADIUS: number = Math.min(width, height) / 2 - 150;
    const ARC_LENGTH: number = 2 * Math.PI;
    const ITEM_SIZE: number = 80;

    // these are not working as expected
    // i think i am using ORBITAL_PERIOD_IN_SECONDS incorrectly in the formula
    // Also, I'd like to find a way to throttle the animation FPS somehow
    const FPS: number = 60;
    const ORBITAL_PERIOD_IN_SECONDS: number = 25000; // once working, should be set to 30
    const debug = false;
    
    const tickRef = useRef<number>(1);
    const animateRef = useRef<boolean>(true);
    const orbitRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();

    const getItemPosition = useCallback((index: number, tick: number) => {
        const angle = ARC_LENGTH * (index / children.length) + 
                      (tick * ARC_LENGTH) / ORBITAL_PERIOD_IN_SECONDS;
        
        // Calculate the x and y position of the item
        const x = Math.cos(angle) * (RADIUS - ITEM_SIZE / 2) + RADIUS - ITEM_SIZE / 2;
        const y = Math.sin(angle) * (RADIUS - ITEM_SIZE / 2) + RADIUS - ITEM_SIZE / 2;
        
        return { x, y };
    }, [children.length, RADIUS, width, height, ITEM_SIZE, ARC_LENGTH]);
    
    // Animation loop; this function will be called every frame
    const animate = useCallback(() => {
        if (!animateRef.current) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }
        
        // Calculate the time delta
        tickRef.current += 1;
        
        // Update the position of each item
        if (orbitRef.current) {
            const items = orbitRef.current.querySelectorAll('.orbit-item');
            items.forEach((item, index) => {
                const { x, y } = getItemPosition(index, tickRef.current);
                (item as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
            });
        }
        
        // Request the next frame
        animationRef.current = requestAnimationFrame(animate);
    }, [getItemPosition]);
    
    // Start/stop animation
    React.useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);
    
    const handleMouseEnter = useCallback(() => {
        animateRef.current = false;
    }, []);
    
    const handleMouseLeave = useCallback(() => {
        animateRef.current = true;
    }, []);
    
    return (
        <Box 
            ref={orbitRef}
            className="orbit" 
            sx={{ 
                width: RADIUS * 2,
                height: RADIUS * 2,
                backgroundColor: debug ? 'red' : undefined,
            }} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            {children.map((item, index) => (
                <Box 
                    key={index} 
                    className="orbit-item" 
                    sx={{
                        backgroundColor: debug ? 'blue' : undefined,
                        position: 'absolute',
                        transform: `translate(${getItemPosition(index, tickRef.current).x}px, ${getItemPosition(index, tickRef.current).y}px)`,
                        width: ITEM_SIZE,
                        height: ITEM_SIZE,
                    }}
                >
                    {item}
                </Box>
            ))}
        </Box>
    );
}