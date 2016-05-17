from ..util.redis_util import redis_util
import json

class FeedItem(object):
    NAMESPACE = 'item:'
    NAMESPACE_COLLECTION = 'items:'
    PIN_MOD = 100000000000000

    def __init__(self, properties):
        # Set the data from the properties
        data = {}
        self.data = data
        data['id'] = properties.get('id')
        data['created_time'] = properties.get('created_time')
        data['link'] = properties.get('link')
        data['type'] = properties.get('type')
        data['likes'] = properties.get('likes').get('count')
        data['comments'] = properties.get('comments').get('count')
        data['pinned'] = False

        if properties.get('caption'):
            data['caption'] = properties.get('caption').get('text')

        if properties.get('images'):
            image = properties.get('images').get('low_resolution')
            data['images_low_url'] = image.get('url')
            data['images_low_width'] = image.get('width')
            data['images_low_height'] = image.get('height')

            image = properties.get('images').get('standard_resolution')
            data['images_standard_url'] = image.get('url')
            data['images_standard_width'] = image.get('width')
            data['images_standard_height'] = image.get('height')

        if properties.get('videos'):
            video = properties.get('videos').get('low_resolution')
            data['videos_low_url'] = video.get('url')
            data['videos_low_width'] = video.get('width')
            data['videos_low_height'] = video.get('height')

            video = properties.get('videos').get('standard_resolution')
            data['videos_standard_url'] = video.get('url')
            data['videos_standard_width'] = video.get('width')
            data['videos_standard_height'] = video.get('height')

    def save(self):
        r = redis_util.redis
        pipe = r.pipeline()

        # Save the item data
        item_id = self.data.get('id')
        key = FeedItem.NAMESPACE + item_id
        pipe.hmset(key, self.data)

        # Add to the creation time list
        collection_key = FeedItem.NAMESPACE_COLLECTION + 'default'
        pipe.zadd(collection_key, self.data.get('created_time'), item_id)

        # Add to the likes list
        collection_key = FeedItem.NAMESPACE_COLLECTION + 'likes'
        pipe.zadd(collection_key, self.data.get('likes'), item_id)

        # Add to the comments list
        collection_key = FeedItem.NAMESPACE_COLLECTION + 'comments'
        pipe.zadd(collection_key, self.data.get('comments'), item_id)

        pipe.execute()

    @staticmethod
    def all(collection_type='default', start=0, count=0):
        r = redis_util.redis
        collection_key = FeedItem.NAMESPACE_COLLECTION + collection_type
        keys = r.zrevrange(collection_key, start, start + count - 1)
        items = [r.hgetall(FeedItem.NAMESPACE + key) for key in keys]
        return items

    @staticmethod
    def count(collection_type='default'):
        r = redis_util.redis
        return r.zcard(FeedItem.NAMESPACE_COLLECTION + collection_type)

    @staticmethod
    def get(item_id):
        r = redis_util.redis
        key = FeedItem.NAMESPACE + item_id
        item = r.hgetall(key)
        return item

    @staticmethod
    def pin(item_id, state):
        r = redis_util.redis
        key = FeedItem.NAMESPACE + item_id
        if (r.exists(key)):
            data = FeedItem.get(item_id)
            # Hacky way to add pin score
            if r.hget(key, 'pinned') == str(state):
                return False

            pin_add = 0
            if state:
                pin_add = FeedItem.PIN_MOD
            else:
                pin_add = -FeedItem.PIN_MOD

            pipe = r.pipeline()
            # Set the new pinned state
            pipe.hset(key, 'pinned', state)

            # Update the creation time list
            collection_key = FeedItem.NAMESPACE_COLLECTION + 'default'
            pipe.zadd(collection_key, pin_add + int(data.get('created_time')), item_id)

            # Update the likes list
            collection_key = FeedItem.NAMESPACE_COLLECTION + 'likes'
            pipe.zadd(collection_key, pin_add + int(data.get('likes')), item_id)

            # Update the comments list
            collection_key = FeedItem.NAMESPACE_COLLECTION + 'comments'
            pipe.zadd(collection_key, pin_add + int(data.get('comments')), item_id)

            pipe.execute()

            return True
        else:
            return False
