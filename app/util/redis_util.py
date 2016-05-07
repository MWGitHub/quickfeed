import redis as redis_lib

class RedisUtil(object):
    def __init__(self):
        self.redis = redis_lib.StrictRedis(host='localhost', port=6379, db=0)

redis_util = RedisUtil()
