import falcon
import json
from models import FeedItem

class FeedResource(object):

    def on_get(self, req, resp):
        collection_type = req.params.get('sort') or 'default'
        start = int(req.params.get('start') or 0)
        count = int(req.params.get('count') or 10)
        if start < 0:
            start = 0
        if count < 0 or count > 10:
            count = 10
        items = FeedItem.all(collection_type, start, count)
        data = {
            'pagination': {
                'next_url': '/api/feed/?sort=%s&start=%s&count=%s' % (collection_type, start + count, count),
                'sort': collection_type,
                'start': start,
                'next_start': start + count,
                'count': count,
                'total': FeedItem.count()
            },
            'items': items
        }
        resp.content_type = 'text/json'
        resp.body = json.dumps(data)
        resp.status = falcon.HTTP_200
