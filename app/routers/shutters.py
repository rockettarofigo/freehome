import requests
from app.routers.hosts import gethostname


def shutterstatus(room, shutter, percentage):
    ip = gethostname(room)
    print(ip,shutter,percentage)


    

    