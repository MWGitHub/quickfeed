import os, sys, json
from ..feed.models import FeedItem
from config import config
import app.feed.fetcher as fetcher

def populate():
    # Check if data file exists, otherwise fetch and create
    items = None
    path = os.path.join('data', 'seed.json')
    if os.path.isfile(path):
        with open(path, 'r') as f:
            items = json.load(f)
    else:
        items = fetcher.fetch(config['quickfeed_user'], 200, config['ig_token'])

        with open(path, 'w') as f:
            json.dump(items, f)

    # Populate the database
    for item in items:
        item = FeedItem(item)
        item.save()
