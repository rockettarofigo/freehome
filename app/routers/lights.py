import requests

def statoluce(room, onoff):
    url = f"http://{room}/relay/0?turn={onoff}"
    requests.get(url)


    