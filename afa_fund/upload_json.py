import json
import sys
import os
from decimal import Decimal
import django

# Set the Django settings module environment variable
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "afa_fund.settings")  # Use your actual settings module path
django.setup()

from core.models import Stock  # Adjust this import based on your app's name

def upload_json(file_path, date_value):
    # Open the JSON file
    with open(file_path) as f:
        data = json.load(f)

    # Process each record and save to database
    for item in data:
        weight = item['weight'].replace(',', '.')  # Adjust for comma separated weight
        stock = Stock(
            symbol=item['symbol'],
            name=item['name'],
            weight=Decimal(weight),  # Convert weight to Decimal
            date=date_value,  # Use the date passed as input
            is_AFA=True
        )
        stock.save()

    print(f"Uploaded {len(data)} records successfully.")

if __name__ == "__main__":
    # Get file path and date from the command line arguments
    if len(sys.argv) != 3:
        print("Usage: python upload_json.py <file_path> <date>")
        sys.exit(1)

    file_path = sys.argv[1]  # First argument is the file path
    date_value = sys.argv[2]  # Second argument is the date (e.g., '2024-09-01')

    upload_json(file_path, date_value)

# python upload_json.py /path/to/your/json_file.json 2024-09-01