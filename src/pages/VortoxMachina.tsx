import json from "@/assets/json/cyoa.json";
import Narration from "@/components/Cyoa/Narration";
import Dialogue from "@/components/Cyoa/Dialogue";
import Action from "@/components/Cyoa/Action";
import Transcript from "@/components/Cyoa/Transcript";
import Divider from '@mui/material/Divider';

export default function VortoxMachina() {
    return (
        <main>
            {
                json.map((line: { type: string; text: string, character?: string }, index: number) => {
                    switch (line.type) {
                        case "narration":
                            return <Narration text={line.text} index={index} />;
                        case "dialogue":
                            return <Dialogue character={line.character || "Unknown"} text={line.text} index={index} />;
                        case "action":
                            return <Action text={line.text} index={index} />;
                        case "transcript":
                            return <>
                                <Transcript text={line.text} index={index} />
                                <Divider />
                            </>;
                        default:
                            return <p key={index}><span style={{ color: "red" }}>Error</span></p>;
                    }
                })
            }
            <Divider />
            <h2>To be continued...</h2>
        </main>
    );
}