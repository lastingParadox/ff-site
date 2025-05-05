export default function Transcript({ text, index }: { text: string, index: number }) {
    return (
        <div className="vm-transcript">
            <p key={index}>{text}</p>
        </div>
    );
}