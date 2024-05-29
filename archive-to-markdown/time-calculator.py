import sys
import re
from datetime import datetime

def parse_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    datetime_pattern = re.compile(r'_\((\d{2}-\w{3}-\d{2} \d{2}:\d{2} [AP]M)\)_')
    datetimes = []

    for line in lines:
        match = datetime_pattern.search(line)
        if match:
            date_time_str = match.group(1)
            date_time_obj = datetime.strptime(date_time_str, '%d-%b-%y %I:%M %p')
            datetimes.append(date_time_obj)
    
    if not datetimes:
        return None, None

    # Ensure all times are from the same date
    first_date = datetimes[0].date()
    filtered_times = [dt for dt in datetimes if dt.date() == first_date]

    if len(filtered_times) < 2:
        return None, first_date

    start_time = filtered_times[0]
    end_time = filtered_times[-1]

    return end_time - start_time, first_date

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <filename>")
        sys.exit(1)
    
    filename = sys.argv[1]
    result, episode_date = parse_file(filename)
    if result:
        total_minutes = result.total_seconds() / 60
        print(f"Episode is {result} or {total_minutes:.0f} minutes long, and occurs on {episode_date}")
    else:
        print("No valid data found or not enough messages from the same date.")
