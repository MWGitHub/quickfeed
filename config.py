import os

config = {
    'ig_client_id': os.environ.get('ig_client_id') or 'none',
    'ig_client_secret': os.environ.get('ig_client_secret') or 'none',
    'ig_token': os.environ.get('ig_token') or 'none',
    'quickfeed_user': os.environ.get('quickfeed_user') or 'none'
}
