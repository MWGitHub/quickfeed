from ..util.redis_util import redis_util

class FeedItem(object):
    NAMESPACE = 'item:'

    def __init__(self, properties):
        data = {}
        self.data = data
        data['id'] = properties.get('id')
        data['created_time'] = properties.get('created_time')
        data['link'] = properties.get('link')
        data['type'] = properties.get('type')
        data['likes'] = properties.get('likes').get('count')
        data['comments'] = properties.get('comments').get('count')

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
        key = FeedItem.NAMESPACE + self.data.get('id')
        r.hmset(key, self.data)
