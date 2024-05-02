from bs4 import BeautifulSoup
from datetime import datetime, timedelta


def parse_timestamp(timestamp_str):
    """
    Parse the timestamp string to a datetime object.
    """
    return datetime.strptime(timestamp_str.strip(), "%d-%b-%y %I:%M %p")


def should_combine(previous_timestamp, current_timestamp):
    """
    Determine if two messages should be combined based on their timestamps.
    """
    time_difference = current_timestamp - previous_timestamp
    return time_difference <= timedelta(minutes=5)


def extract_messages(html_content):
    """
    Extract messages from the HTML content of a Discord export.
    """
    soup = BeautifulSoup(html_content, "html.parser")
    messages = []
    message_groups = soup.find_all(class_="chatlog__message-group")

    previous_author = None
    previous_timestamp = None
    combined_message = ""

    for group in message_groups:
        author = (
            group.find(class_="chatlog__author-name").get_text(strip=True)
            if group.find(class_="chatlog__author-name")
            else "Unknown"
        )
        timestamp_str = (
            group.find(class_="chatlog__timestamp").get_text(strip=True)
            if group.find(class_="chatlog__timestamp")
            else "Unknown"
        )
        timestamp = parse_timestamp(timestamp_str)
        content_elements = group.find_all(class_="chatlog__content")

        for content_element in content_elements:
            content = "\n".join(
                line.strip() for line in content_element.stripped_strings
            )

            if (
                author == previous_author
                and previous_timestamp
                and should_combine(previous_timestamp, timestamp)
            ):
                combined_message += "\n> " + content
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
                combined_message = "> " + content

            previous_author = author
            previous_timestamp = timestamp

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
    """
    Convert the list of messages to Markdown format.
    """
    markdown = ""
    for msg in messages:
        markdown += f"**{msg['author']}** *({msg['timestamp']})*\n{msg['content']}\n\n"
    return markdown


def parse_html_to_markdown(file_path):
    """
    Parse an HTML file and convert its content to Markdown.
    """
    with open(file_path, "r") as file:
        html_content = file.read()

    messages = extract_messages(html_content)
    return convert_to_markdown(messages)


# Example usage:
markdown_content = parse_html_to_markdown("./ff-archive/ff2.html")
with open("./md/ff2/ff2.md", "w") as file:
    file.write(markdown_content)
