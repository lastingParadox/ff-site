import React, { useRef, useEffect } from 'react';

function hexToRgb(hex: string): number[] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
}

const PixelArtWithOutline: React.FC<{ imageUrl: string; color?: string; zoom?: number }> = ({
    imageUrl,
    color = '#FFFFFF',
    zoom = 5,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        const image = new Image();
        image.src = imageUrl;

        image.onload = async () => {
            canvas.width = image.width + 2;
            canvas.height = image.height + 2;

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, 1, 1, image.width, image.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const outlineColor = hexToRgb(color); // white outline

            const fillPixels = [];
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] === 0) {
                    const x = (i / 4) % canvas.width;
                    const y = Math.floor(i / 4 / canvas.width);

                    // Pixel to the left
                    if (x > 0 && data[i - 1] !== 0 && y < canvas.height - 1) {
                        fillPixels.push(i);
                    }
                    // Pixel to the right
                    else if (x < canvas.width && data[i + 7] !== 0 && y < canvas.height - 1) {
                        fillPixels.push(i);
                    }
                    // Pixel above
                    else if (y > 0 && data[i - canvas.width * 4 + 3] !== 0) {
                        fillPixels.push(i);
                    }
                    // Pixel below
                    else if (y < canvas.height && data[i + canvas.width * 4 + 3] !== 0 && y < canvas.height - 1) {
                        fillPixels.push(i);
                    }
                }
            }

            for (const pixel of fillPixels) {
                data[pixel] = outlineColor[0];
                data[pixel + 1] = outlineColor[1];
                data[pixel + 2] = outlineColor[2];
                data[pixel + 3] = outlineColor[3];
            }

            canvas.height = canvas.height * zoom;
            if (canvas.height > 80) canvas.height = 80;
            canvas.width = canvas.width * zoom;
            if (canvas.width > 80) canvas.width = 80;

            const bitmap = await createImageBitmap(imageData);

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        };
    }, [color, imageUrl, zoom]);

    return <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />;
};

export default PixelArtWithOutline;
