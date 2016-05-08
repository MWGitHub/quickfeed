import falcon
import falcon.testing as testing
import json
import app.util.seeder as seeder
from app.feed.controllers import FeedResource

class FeedTestCase(testing.TestBase):
    def setUp(self):
        super(FeedTestCase, self).setUp()
        self.api.add_route('/api/feed', FeedResource())
        seeder.populate()

    def test_get(self):
        url = '/api/feed'
        resp = json.loads(self.simulate_request(url)[0])
        self.assertEqual(len(resp['items']), 10, 'Invalid number of items')

    def test_get_order(self):
        # Check time ordering
        url = '/api/feed'
        resp = json.loads(self.simulate_request(url)[0])
        items = resp['items']
        self.assertEqual(len(items), 10, 'Invalid number of items')
        for i in xrange(1, len(items)):
            item = items[i]
            prev = items[i - 1]
            self.assertTrue(int(item['created_time']) <= int(prev['created_time']))

        # Check likes ordering
        resp = json.loads(self.simulate_request(url, query_string='sort=likes')[0])
        items = resp['items']
        self.assertEqual(len(items), 10, 'Invalid number of items')
        for i in xrange(1, len(items)):
            item = items[i]
            prev = items[i - 1]
            self.assertTrue(int(item['likes']) <= int(prev['likes']))

        # Check comments ordering
        resp = json.loads(self.simulate_request(url, query_string='sort=comments')[0])
        items = resp['items']
        self.assertEqual(len(items), 10, 'Invalid number of items')
        for i in xrange(1, len(items)):
            item = items[i]
            prev = items[i - 1]
            self.assertTrue(int(item['comments']) <= int(prev['comments']))

    def test_get_pagination(self):
        url = '/api/feed'
        resp = json.loads(self.simulate_request(url)[0])
        items = resp['items']
        resp = json.loads(self.simulate_request(url, query_string='start=' + str(resp['pagination']['next_start']))[0])
        next_items = resp['items']

        # Check that no items are the same
        for i in xrange(0, len(items)):
            self.assertTrue(items[i]['id'] != next_items[i]['id'])

        resp = json.loads(self.simulate_request(url, query_string='start=1000')[0])
        items = resp['items']
        self.assertEqual(len(resp['items']), 0, 'Invalid number of items')
