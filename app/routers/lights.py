import requests

def statoluce(stanza, onoff):
    url = f"http://{stanza}/relay/0?turn={onoff}"
    requests.get(url)


    