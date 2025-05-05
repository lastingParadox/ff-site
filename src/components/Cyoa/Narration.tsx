export default function Narration({ text, index }: { text: string, index: number }) {
    return (
        <p className="vm-narration" key={index}>{text}</p>
    );
}