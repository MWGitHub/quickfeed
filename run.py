import os, sys
import pdb
import json
import falcon
from config import config
from app.feed.controllers import FeedResource
from app.feed.models import FeedItem
import app.util.seeder as seeder

app = falcon.API()

ALLOWED_TYPES = {
    'html': 'text/html',
    'json': 'application/json',
    'js': 'text/javascript',
    'css': 'text/css'
}

# Add the static page root for development use
class Root(object):
    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.content_type = 'text/html'
        with open('frontend/index.html', 'r') as f:
            resp.body = f.read()
app.add_route('/', Root())

# Add static resources for development use
class StaticResource(object):
    def on_get(self, req, resp, **kwargs):
        path = req.path[1:].replace('..', '')
        ext = path.split('.')[-1]
        if ALLOWED_TYPES.get(ext) is None:
            resp.content_type = 'application/json'
        else:
            resp.content_type = ALLOWED_TYPES.get(ext)
        resp.status = falcon.HTTP_200
        try:
            with open(path, 'r') as f:
                resp.body = f.read()
        except:
            resp.status = falcon.HTTP_404
app.add_route('/static/{type}/{file}', StaticResource())

# Add the feed resource and route
feed = FeedResource()
app.add_route('/api/feed', feed)

# Fetch the intial data
print 'Fetching initial data...'
seeder.populate()
print 'Fetch complete'
