import os, sys
import pdb
import json
import falcon
import redis
from config import config
from app.feed.controllers import FeedResource
import app.feed.fetcher as fetcher

r = redis.StrictRedis(host='localhost', port=6379, db=0)

app = falcon.API()

# Add the static page root for development use
class Root(object):
    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.content_type = 'text/html'
        with open('frontend/index.html', 'r') as f:
            resp.body = f.read()
app.add_route('/', Root())

# Add the feed resource and route
feed = FeedResource()
app.add_route('/api/feed', feed)

# Check if data file exists, otherwise fetch and create
items = None
if os.path.isfile('data.json'):
    with open('data.json', 'r') as f:
        items = json.load(f)
else:
    items = fetcher.fetch(config['quickfeed_user'], 200, config['ig_token'])

    with open('data.json', 'w') as f:
        json.dump(items, f)
