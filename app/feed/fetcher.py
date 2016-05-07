import requests

def fetch(user, count, token):
    uri = 'https://api.instagram.com/v1/users/%s/media/recent?access_token=%s' % (user, token)
    req = requests.get(uri)
    data = req.json()
    items = data['data']
    next_uri = None
    while len(items) < count:
        # Out of items
        if next_uri == data['pagination']['next_url']:
            break

        next_uri = data['pagination']['next_url']
        req = requests.get(next_uri)
        data = req.json()
        items = items + data['data']
    return items[0:count]
