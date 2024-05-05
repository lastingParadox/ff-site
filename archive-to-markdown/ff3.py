from bs4 import BeautifulSoup
from datetime import datetime, timedelta

player_list = {
    "Zander": "Zander",
    "Trey Moment": "Trey",
    "Sean.": "Sean",
    "Lili": "Lili",
    "Brody": "Brody",
    "Rashidi": "Rashidi",
    "Jonas": "Jonas",
    "Hyper-Realistic Blood.": "Cooldude",
    "Sib": "Silas",
    "Multi": "Bill",
    "Michael": "Michael",
    "ScootyDooty": "Preston",
    "Hunter": "Hunter",
    "Tatsu": "FFBot",
    "Æsir": "Charles",
    "FF 8Ball": "FFBot",
}

character_list = {
    "Zander": "Emmett",
    "Trey": "Garrick",
    "Sean": "Seth",
    "Lili": "Iris",
    "Brody": "Sanya",
    "Rashidi": "Dakari",
    "Jonas": "Chomsky",
    "Cooldude": "Wemmfort",
    "Silas": "Wes",
    "Bill": "Burner",
    "Michael": "Theylin",
    "Preston": "Volentina",
    "Hunter": "Rachell",
    "Charles": "Vargas",
}


def parse_timestamp(timestamp_str):
    """
    Parse the timestamp string to a datetime object.
    """
    return datetime.strptime(timestamp_str, "%d-%b-%y %I:%M %p")


def should_combine(previous_timestamp, current_timestamp):
    """
    Determine if two messages should be combined based on their timestamps.
    """
    time_difference = current_timestamp - previous_timestamp
    return time_difference <= timedelta(minutes=5)


def extract_messages(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    messages = []
    message_groups = soup.find_all(class_="chatlog__messages")

    previous_author = None
    previous_timestamp = None
    previous_element = None
    combined_message = ""

    for group in message_groups:
        author = player_list.get(
            (
                group.find(class_="chatlog__author-name").get_text(strip=True)
                if group.find(class_="chatlog__author-name")
                else "Unknown"
            ),
            "Unknown",
        )
        timestamp = parse_timestamp(
            group.find(class_="chatlog__timestamp").get_text(strip=True)
            if group.find(class_="chatlog__timestamp")
            else "Unknown"
        )
        content_elements = group.find_all(class_="chatlog__message")
        combine_previous = (
            author == previous_author
            and previous_timestamp
            and should_combine(previous_timestamp, timestamp)
        )

        for content_element in content_elements:
            content = ""

            markdown_container = content_element.find(class_="markdown")
            preserve_whitespace = (
                markdown_container.find(class_="preserve-whitespace")
                if markdown_container
                else None
            )

            if preserve_whitespace:
                preserve_whitespace_text = preserve_whitespace.get_text().strip("\n")
                previous_element = previous_element if combine_previous else None

                # If there's a strong element, we want to bold the entire message
                strong_elements = preserve_whitespace.find_all("strong")
                if len(strong_elements) > 0:
                    img_content = preserve_whitespace.find("img", alt=True)
                    if img_content:
                        content += f"{img_content['alt']}{preserve_whitespace_text}"
                    else:
                        content += preserve_whitespace_text

                else:
                    preserve_whitespace_children = markdown_container.find(
                        class_="preserve-whitespace"
                    ).findChildren()
                    for element in preserve_whitespace_children:
                        if element.name == "em":
                            temp = element.get_text().strip("\n")
                            if previous_element != "em":
                                content += "\n\n"
                            content += f"*{temp}*"
                            previous_element = "em"
                        elif element.name == "span" and "pre--inline" in element.get(
                            "class", []
                        ):
                            temp = element.get_text().strip("\n")
                            if previous_element == "em":
                                content += "\n"
                            character_name = character_list.get(author, "Person")
                            content += f"> {character_name}: {temp}"
                            previous_element = "pre--inline"
                        else:
                            content += element.get_text().strip("\n")
                            previous_element = "other"
                    if len(preserve_whitespace_children) == 0:
                        content += markdown_container.get_text().strip("\n")

            content = content.replace("’", "'")
            # If

            if combine_previous:
                combined_message += "\n" + content
            else:
                if combined_message:
                    messages.append(
                        {
                            "author": previous_author,
                            "timestamp": previous_timestamp.strftime(
                                "%d-%b-%y %I:%M %p"
                            ),
                            "content": combined_message,
                        }
                    )
                combined_message = content

            previous_author = author
            previous_timestamp = timestamp

    # Adding the last message if any
    if combined_message:
        messages.append(
            {
                "author": previous_author,
                "timestamp": previous_timestamp.strftime("%d-%b-%y %I:%M %p"),
                "content": combined_message,
            }
        )

    return messages


def convert_to_markdown(messages):
    markdown = ""
    for msg in messages:
        markdown += f"**{msg['author']}** *({msg['timestamp']})*\n{msg['content']}\n\n"
    return markdown


def parse_html_to_markdown(file_path):
    with open(file_path, "r") as file:
        html_content = file.read()

    messages = extract_messages(html_content)
    return convert_to_markdown(messages)


# Example usage:
markdown_content = parse_html_to_markdown("./ff-archive/ff3.html")

with open("./md/ff3/ff3.md", "w") as file:
    file.write(markdown_content)
