export default function Action({ text, index }: { text: string, index: number }) {
    return (
        <h2 className="vm-action" key={index}>{text}</h2>
    );
}