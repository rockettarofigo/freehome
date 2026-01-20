import requests
from app.routers.hosts import gethostname


def lightstatus(room, onoff):
    ip = gethostname(room)
    url = f"http://{ip}/relay/0?turn={onoff}"
    requests.get(url)


    