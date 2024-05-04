import re
import json
import emoji


def get_character_from_player(player):
    match player:
        case "Zander":
            return "Emmett"
        case "Silas":
            return "Laav"
        case "Trey":
            return "Garrick"
        case "Sean":
            return "Seth"
        case "Brody":
            return "Serpile"
        case "Maxwell":
            return "Matthias"
        case "Josh":
            return "Jacob"
        case "Jonas":
            return "Asier"
        case "TheBlade":
            return "Jim"
        case _:
            return None


def get_player_from_username(username):

    match username:
        case "Bagelwrecker":
            return "Sean"
        case "Brakia":
            return "Brody"
        case "Enchantingtable2013":
            return "Maxwell"
        case "Tatsumaki" | "Magic8Ball":
            return "FF 8 Ball"
        case "ProfessorTree":
            return "Silas"
        case "Santa is Dead":
            return "Jonas"
        case "Master JRM":
            return "Josh"
        case _:
            return username


def parse_blocks(md_file):
    blocks = []
    current_block = {}
    with open(md_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:  # Skip empty lines
                continue
            if line.startswith("**") and "_(" in line and ")" in line:
                if current_block:
                    blocks.append(current_block)
                current_block = {
                    "content": [],
                    "quotes": None,
                    "commands": None,
                    "actions": None,
                    "other": None,
                }
                player_date = re.search(r"\*\*(.*?)\*\* _\((.*?)\)", line)
                username = player_date.group(1)
                current_block["player"] = get_player_from_username(username)
                # current_block["player"] = username
                current_block["character"] = get_character_from_player(
                    current_block["player"]
                )
                current_block["date"] = player_date.group(2)
            elif line.startswith(">"):
                if not current_block.get("quotes"):
                    current_block["quotes"] = []
                # Another character could be speaking, which is identified by "_CharacterName_:" at the beginning of the line after the "> "
                if "`" and "`:" in line:
                    character_quote = re.search(r"> `(.+)`: (.+)", line)
                    current_block["character"] = character_quote.group(1)
                    dialogue = character_quote.group(2)
                    current_block["content"].append(dialogue)
                else:
                    current_block["content"].append(line[2:])
                current_block["quotes"].append(len(current_block["content"]) - 1)
            elif line.startswith("t!") or line.startswith("@Magic"):
                if not current_block.get("commands"):
                    current_block["commands"] = []
                current_block["content"].append(line)
                current_block["commands"].append(len(current_block["content"]) - 1)
            elif re.search(r"_(.+)_", line):
                if not current_block.get("actions"):
                    current_block["actions"] = []
                # Another character could be taking the action, which is identified by "*_CharacterName_:" at the beginning of the line
                if "`" in line and "`:" in line:
                    character_action = re.search(r"_`(.+)`: (.+)_", line)
                    current_block["character"] = character_action.group(1)
                    action = character_action.group(2)
                    current_block["content"].append(action)
                else:
                    current_block["content"].append(re.search(r"_(.+)_", line).group(1))
                current_block["actions"].append(len(current_block["content"]) - 1)
            else:
                if not current_block.get("other"):
                    current_block["other"] = []
                # Convert from unicode to emoji
                line_with_emojis = emoji.demojize(line)
                line_with_emojis = emoji.emojize(line_with_emojis)
                current_block["content"].append(line_with_emojis)
                current_block["other"].append(len(current_block["content"]) - 1)
    if current_block:
        blocks.append(current_block)
    return blocks


def convert_to_json(blocks, json_file):
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(blocks, f, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    md_file = "./md/ff2/dreamin-scary.md"
    json_file = "../../src/assets/json/archives/ff2/dreamin-scary.json"
    blocks = parse_blocks(md_file)
    episode_dict = {
        "title": "Dreamin' Scary",
        "episode_number": 4,
        "short_desc": "Some of the crew is stuck in an awful raunchy shared dream.",
        "blocks": blocks,
    }
    convert_to_json(episode_dict, json_file)
