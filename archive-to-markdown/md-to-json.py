import glob
import json
import os
import re
import sys


def get_character_from_player(player, episode_number):

    match player:
        case "Zander":
            name_obj = {"1": "Emmett"}
        case "Silas":
            name_obj = {"1": "Laav", "13": "KYL300"}
        case "Trey":
            name_obj = {"1": "Garrick"}
        case "Sean":
            name_obj = {"1": "Seth"}
        case "Brody":
            name_obj = {"1": "Serpile", "5": "Bail", "7": "Ibraxas", "11": "Sanya"}
        case "Maxwell":
            name_obj = {"1": "Matthias", "15": "Matieu"}
        case "Josh":
            name_obj = {"1": "Jacob"}
        case "Jonas":
            name_obj = {"1": "Asier", "13": "Chomsky"}
        case "TheBlade":
            name_obj = {"1": "Jim"}
        case "Arky":
            name_obj = {"1": "Lucian"}
        case "Mica":
            name_obj = {"1": "Maia"}
        case "Tom Thompson":
            name_obj = {"1": "Mickey Mouse's Ghost"}
        case "Finna Steel Christmas":
            name_obj = {"1": "Steely"}
        case "Nick":
            name_obj = {"1": "Lodas"}
        case "Rashidi":
            name_obj = {"1": "Danny"}
        case "Lili":
            name_obj = {"1": "Iris"}
        case "Bill":
            name_obj = {"1": "Hector"}
        case _:
            name_obj = {"1": None}

    episode_numbers = [int(ep) for ep in name_obj.keys()]
    episode_numbers.sort()

    for index, ep in enumerate(episode_numbers):
        if ep == int(episode_number):
            return name_obj[str(ep)]
        if ep > int(episode_number):
            if index - 1 < 0:
                return name_obj[str(episode_numbers[index])]
            else:
                return name_obj[str(episode_numbers[index - 1])]
    return name_obj[str(episode_numbers[-1])]


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
        case "Mr.WobblyShark":
            return "Nick"
        case "Platinum_Pathos":
            return "Rashidi"
        case "Jelsafan0":
            return "Lili"
        case "WatchfulDrake":
            return "Bill"
        case _:
            return username


# Define a regex pattern to match the block header lines
block_header_pattern = re.compile(r"\*\*(.*?)\*\* _\((.*?)\)")


def process_file(filename, title, episode_number, short_desc):
    with open(filename, "r", encoding="utf-8") as file:
        blocks = []
        current_block = []

        for line in file:
            line = line.strip()
            if block_header_pattern.match(line):
                # If current_block is not empty, it means we have completed a block
                if current_block:
                    blocks.append(current_block)
                    current_block = []
                # Start a new block with the header line
                current_block.append(line)
            else:
                # Add line to the current block
                if not line:
                    continue
                current_block.append(line)

        # Don't forget to add the last block if the file doesn't end with a block header
        if current_block:
            blocks.append(current_block)

    processed_blocks = []

    # Process each block
    for block in blocks:
        processed_blocks.append(process_block(block, episode_number))

    return {
        "title": title,
        "episode_number": episode_number,
        "short_desc": short_desc,
        "blocks": processed_blocks,
    }


def process_block(block, episode_number):
    # Assuming the first line is the block header
    processed_block = {}
    header = block[0]
    content_lines = block[1:]

    match = block_header_pattern.match(header)
    if match:
        username = get_player_from_username(match.group(1))
        character = get_character_from_player(username, episode_number)
        datetime = match.group(2)
    else:
        print("Invalid block header format.")
        return

    processed_block = {
        "player": username,
        "character": character,
        "date": datetime,
        "content": [],
    }

    embed_type = None
    current_embed = None
    for line in content_lines:
        if re.search(r"</(.+)>", line):
            match = re.search(r"</(.+)>", line)
            temp_embed_type = match.group(1)
            if temp_embed_type == "embed":
                processed_block["content"].append(current_embed)
                embed_type = None
            continue
        elif re.search(r"<(.+)>", line):
            match = re.search(r"<(.+)>", line)
            embed_type = match.group(1)
            if embed_type == "embed":
                current_embed = {
                    "type": "embed",
                    "embed": {},
                }
            else:
                current_embed["embed"][embed_type] = []
            continue
        processed_line, line_character = process_line(line, username, character)

        if line_character != character:
            character = line_character
            processed_block["character"] = character
        if embed_type:
            current_embed["embed"][embed_type].append(processed_line["text"])
        else:
            processed_block["content"].append(processed_line)

    return processed_block


def process_line(line, player, character):
    # Line categories: bot_response, commmand, quote, action, embed, other
    # Bot Response Case
    if player == "FF 8 Ball":
        return {"type": "bot_response", "text": line}, character
    # Quote Case
    elif line.startswith(">"):
        line = line[2:]
        if "`" and "`:" in line:
            match = re.search(r"`(.+)`: (.+)", line)
            character = match.group(1)
            line = match.group(2)
        return {"type": "quote", "text": line}, character
    # Action Case
    elif re.search(r"_(.+)_", line):
        if "`" and "`:" in line:
            match = re.search(r"_`(.+)`: (.+)_", line)
            character = match.group(1)
            line = match.group(2)
        else:
            match = re.search(r"_(.+)_", line)
            line = match.group(1)
        return {"type": "action", "text": line}, character
    # Command Case
    elif "@Magic" in line or "t!" in line:
        if line.startswith("`") and "`:" in line:
            match = re.search(r"`(.+)`: (.+)", line)
            character = match.group(1)
            line = match.group(2)

        return {"type": "command", "text": line}, character
    else:
        return {"type": "other", "text": line}, character


def convert_to_json(blocks, json_file):
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(blocks, f, indent=4, ensure_ascii=False)


def extract_episode_number_from_filename(filename):
    match = re.match(r"(\d{2})-.*", filename)
    if match:
        return match.group(1)
    return None


def natural_sort_key(s):
    return [
        int(text) if text.isdigit() else text.lower() for text in re.split(r"(\d+)", s)
    ]


def get_episode_number(md_file, provided_episode_number=None):

    if provided_episode_number:
        return provided_episode_number

    base_name = os.path.basename(md_file)
    episode_number = extract_episode_number_from_filename(base_name)
    if episode_number:
        return episode_number

    all_files = sorted(glob.glob("./md/ff2/*.md"), key=natural_sort_key)

    return all_files.index(md_file) + 1


if __name__ == "__main__":
    if len(sys.argv) < 1:
        print("Usage: python md-to-json.py <season_name>")
        sys.exit(1)

    # If the season name is not provided, or is not a valid season name, print an error message and exit
    if sys.argv[1] not in ["ff2", "ff3", "ff4"]:
        print(
            "Invalid season name. Please provide a valid season name (ff2, ff3, ff4)."
        )
        sys.exit(1)

    json_file = f"../src/assets/json/{sys.argv[1]}.json"

    # If the json file does not exist, print an error message and exit
    if not os.path.exists(json_file):
        print(f"JSON file {json_file} does not exist.")
        sys.exit(1)

    with open(json_file, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    md_files = sorted(glob.glob(f"./md/{sys.argv[1]}/*.md"), key=natural_sort_key)

    # If the md files do not exist, print an error message and exit
    if not md_files:
        print(f"No markdown files found in ./md/{sys.argv[1]}/.")
        sys.exit(1)

    for md_file in md_files:
        filename = md_file.split("/")[-1].split(".")[0]
        filename = re.sub(r"\d+-", "", filename)

        try:
            episode_data = next(
            episode for episode in metadata if episode["file_name"] == filename
            )
        except StopIteration:
            print(f"No metadata found for {filename}. Skipping. (Add an episode to the json file if you want to process this file.)")
            continue

        json_file = (
            f"../src/assets/json/archives/{sys.argv[1]}/"
            + str(episode_data["episode_number"])
            + "-"
            + filename
            + ".json"
        )

        processed_file = process_file(
            md_file,
            episode_data["title"],
            episode_data["episode_number"],
            episode_data["short_desc"],
        )

        convert_to_json(processed_file, json_file)
        print(f"Processed {md_file} to {json_file}")
