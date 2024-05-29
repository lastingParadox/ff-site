import sys
import re
from datetime import datetime, timedelta
from collections import defaultdict

def parse_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    datetime_pattern = re.compile(r'_\((\d{2}-\w{3}-\d{2} \d{2}:\d{2} [AP]M)\)_')
    messages_by_date = defaultdict(list)

    for line in lines:
        match = datetime_pattern.search(line)
        if match:
            date_time_str = match.group(1)
            date_time_obj = datetime.strptime(date_time_str, '%d-%b-%y %I:%M %p')
            messages_by_date[date_time_obj.date()].append(date_time_obj)

    total_duration = timedelta()  # Corrected to use a timedelta object for accumulation
    date_list = []

    for date, timestamps in messages_by_date.items():
        if len(timestamps) >= 2:
            start_time = min(timestamps)
            end_time = max(timestamps)
            duration = end_time - start_time
            total_duration += duration  # Directly add the timedelta object
            date_list.append(date)

    return total_duration, date_list

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <filename>")
        sys.exit(1)
    
    filename = sys.argv[1]
    total_time, dates = parse_file(filename)
    total_minutes = total_time.total_seconds() / 60

    print(f"Total time across all dates: {total_minutes:.0f} minutes")
    print("Dates processed:")
    for date in dates:
        print(date.strftime('%d-%b-%Y'))
