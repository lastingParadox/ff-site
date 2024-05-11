import re
import json
import emoji
import sys

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
            return "Ibraxas"
        case "Maxwell":
            return "Matthias"
        case "Josh":
            return "Jacob"
        case "Jonas":
            return "Asier"
        case "TheBlade":
            return "Jim"
        case "Tom Thompson":
            return "Mickey Mouse's Ghost"
        case "Finna Steel Christmas":
            return "Steely"
        case "Mica":
            return "Maia"
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
        case "Santa is Dead" | "PlasmaPerson":
            return "Jonas"
        case "Master JRM":
            return "Josh"
        case "RPretribution":
            return "Trey"
        case _:
            return username


def parse_blocks(md_file):
    blocks = []
    current_block = {}
    current_embed = {}
    with open(md_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:  # Skip empty lines
                continue
            line = emoji.emojize(emoji.demojize(line))
            # Title Case
            if line.startswith("**") and "_(" in line and ")" in line:
                if current_embed:
                    current_block["content"].append(current_embed)
                if current_block:
                    blocks.append(current_block)
                current_embed = {}
                current_block = {
                    "content": [],
                }
                player_date = re.search(r"\*\*(.*?)\*\* _\((.*?)\)", line)
                username = player_date.group(1)
                current_block["player"] = get_player_from_username(username)
                # current_block["player"] = username
                current_block["character"] = get_character_from_player(
                    current_block["player"]
                )
                current_block["date"] = player_date.group(2)
            # Embed Case
            # Line starts with <title>, <description>, or <footer> and ends with </title>, </description>, or </footer>
            elif line.startswith("<") and line.endswith(">"):
                if "title" in line:
                    if current_embed:
                        current_block["content"].append(current_embed)
                        current_embed = {}
                    current_embed = {"type": "embed"}
                    if "embed" not in current_embed:
                        current_embed["embed"] = {}
                    current_embed["embed"]["title"] = line[7:-8]
                elif "description" in line:
                    if "embed" not in current_embed:
                        current_embed["embed"] = {}
                    if not "description" in current_embed["embed"]:
                        current_embed["embed"]["description"] = [line[13:-14]]
                    else:
                        current_embed["embed"]["description"].append(line[13:-14])
                elif "footer" in line:
                    if "embed" not in current_embed:
                        current_embed["embed"] = {}
                    current_embed["embed"]["footer"] = line[8:-9]
            # Bot Case
            elif current_block["player"] == "FF 8 Ball":
                dict = {
                    "type": "bot_response",
                }
                dict["text"] = line
                current_block["content"].append(dict)
            # Quote Case
            elif line.startswith(">"):
                dict = {
                    "type": "quote",
                }
                if "`" and "`:" in line:
                    character_quote = re.search(r"> `(.+)`: (.+)", line)
                    current_block["character"] = character_quote.group(1)
                    dict["text"] = character_quote.group(2)
                else:
                    dict["text"] = line[2:]

                current_block["content"].append(dict)
            # Action Case
            elif re.search(r"_(.+)_", line):
                dict = {
                    "type": "action",
                }
                if "`" in line and "`:" in line:
                    character_action = re.search(r"_`(.+)`: (.+)_", line)
                    current_block["character"] = character_action.group(1)
                    dict["text"] = character_action.group(2)
                else:
                    dict["text"] = re.search(r"_(.+)_", line).group(1)

                current_block["content"].append(dict)
            # Command Case
            elif (
                current_block["player"] != "FF 8 Ball"
                and "t!" in line
                or "@Magic" in line
            ):
                dict = {
                    "type": "command",
                }

                if line.startswith("`") and "`:" in line:
                    character_command = re.search(r"`(.+)`: (.+)", line)
                    current_block["character"] = character_command.group(1)
                    dict["text"] = character_command.group(2)
                else:
                    dict["text"] = line

                current_block["content"].append(dict)
            else:
                if current_embed:
                    if "description" not in current_embed["embed"]:
                        current_embed["embed"]["description"] = [line]
                    else:
                        current_embed["embed"]["description"].append(line)
                else:
                    dict = {
                        "type": "other",
                    }

                    dict["text"] = line
                    current_block["content"].append(dict)
    if current_block:
        blocks.append(current_block)
    return blocks


def convert_to_json(blocks, json_file):
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(blocks, f, indent=4, ensure_ascii=False)

def convert_to_filename(string):
    # Remove non-alphabet characters
    string = ''.join(char for char in string if char.isalpha())
    # Convert to lowercase
    string = string.lower()
    # Convert to kebab case
    string = '-'.join(string.split())
    return string

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python md-to-json.py <title> <episode_number> <description>")
        sys.exit(1)
    filename = convert_to_filename(sys.argv[1])
    md_file = "./md/ff2/" + filename + ".md"
    json_file = "../src/assets/json/archives/ff2/" + filename + ".json"
    blocks = parse_blocks(md_file)
    episode_dict = {
        "title": sys.argv[1],
        "episode_number": sys.argv[2],
        "short_desc": sys.argv[3],
        "blocks": blocks,
    }
    convert_to_json(episode_dict, json_file)
