import PixelArtWithOutline from '@/components/PixelArtWithOutline/PixelArtWithOutline';

export default function FF3() {
    return (
        <div>
            <h1>FF3</h1>
            <p>FF3 is a great game!</p>
            <PixelArtWithOutline imageUrl={new URL('@/assets/images/avatars/emmett.png', import.meta.url).href} />
            <PixelArtWithOutline imageUrl={new URL('@/assets/images/avatars/garrick.png', import.meta.url).href} />
            <PixelArtWithOutline imageUrl={new URL('@/assets/images/avatars/seth.png', import.meta.url).href} />
            <PixelArtWithOutline imageUrl={new URL('@/assets/images/avatars/sanya.png', import.meta.url).href} />
            <PixelArtWithOutline imageUrl={new URL('@/assets/images/avatars/chomsky.png', import.meta.url).href} />
        </div>
    );
}
