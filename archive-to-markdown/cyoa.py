import json
import re

def parse_text_to_json(input_text):
    lines = input_text.split("\n")
    parsed_data = []

    for line in lines:
        if not line.strip():  # Skip empty lines
            continue
        
        # Case 1: Dialogue (up to 5 characters followed by a colon)
        dialogue_match = re.match(r"^(\S{1,5}):\s*(.*)$", line)
        if dialogue_match:
            character = dialogue_match.group(1)
            text = dialogue_match.group(2)
            parsed_data.append({
                "type": "dialogue",
                "character": character,
                "text": text
            })
            continue
        
        # Case 2: Action (contains "⇒")
        if "⇒" in line:
            parsed_data.append({
                "type": "action",
                "text": line.strip()
            })
            continue
        
        # Case 3: Narration (default case)
        parsed_data.append({
            "type": "narration",
            "text": line.strip()
        })

    return json.dumps(parsed_data, indent=4)


def convert_file_to_json(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        input_text = file.read()
    
    result_json = parse_text_to_json(input_text)
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(result_json)

    print(f"Conversion complete. JSON saved to {output_file}")


# Example usage:
input_file = "md/cyoa.md"  # Replace with your actual file path
output_file = "../src/assets/json/cyoa.json"  # Desired output file path
convert_file_to_json(input_file, output_file)
