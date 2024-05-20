import re


def get_word_count(file_path):
    with open(file_path, "r") as file:
        content = file.read()

    # Remove lines containing usernames and dates
    filtered_content = re.sub(r"\*\*.*?\*\* _\(.*?\)_\n", "", content)

    # Remove lines starting with @, 🎱 |, and t!
    filtered_content = re.sub(r"^\s*@.*$\n?", "", filtered_content, flags=re.MULTILINE)
    filtered_content = re.sub(
        r"^\s*[🎱🤔].*$\n?", "", filtered_content, flags=re.MULTILINE
    )
    filtered_content = re.sub(r"^\s*t!.*$\n?", "", filtered_content, flags=re.MULTILINE)

    # Now, let's count the words in the filtered content
    words = re.findall(r"\b\w+\b", filtered_content)
    word_count = len(words)

    return word_count


# Loop over all the files in the archive folder
import os

archive_folder = "./md/ff2"

word_counts = []

for file_name in os.listdir(archive_folder):

    # Skip the ff2.md file
    if file_name == "ff2.md":
        continue

    word_count = 0

    file_path = os.path.join(archive_folder, file_name)
    word_count += get_word_count(file_path)

    # Get the name of the file without the extension and without hyphens and title case every word

    file_name = file_name.replace(".md", "").replace("-", " ").title()

    word_counts.append({"name": file_name, "word_count": word_count})

# Sort the word counts in descending order
word_counts.sort(key=lambda x: x["word_count"], reverse=True)

# Print the word counts
for word_count in word_counts:
    print(f"{word_count['name']}: {word_count['word_count']} words")
