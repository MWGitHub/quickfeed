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

class PinResource(object):

    def on_post(self, req, resp):
        # print req.stream.read()
        # try:
        #     raw = req.stream.read()
        # except Exception as ex:
        #     raise falcon.HTTPError(falcon.HTTP_400,
        #         'Error',
        #         ex.message)
        #
        # try:
        #     result = json.loads(raw, encoding='utf-8')
        # except ValueError:
        #     raise falcon.HTTPError(falcon.HTTP_400,
        #         'Malformed JSON',
        #         'Could not decode the request body. The '
        #         'JSON was incorrect.')
        result = req.stream.read().split('&')
        item_id = result[0].split('=')[1]
        pinned = result[1].split('=')[1]
        if pinned == 'False':
            pinned = False
        else:
            pinned = True

        success = FeedItem.pin(item_id, pinned)

        resp.content_type = 'text/json'

        if success:
            resp.body = json.dumps(FeedItem.get(item_id))
            resp.status = falcon.HTTP_200
        else:
            resp.status = falcon.HTTP_400
