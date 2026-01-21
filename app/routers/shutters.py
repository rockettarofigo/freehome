import requests
from app.routers.hosts import getshuttername


def shutterstatus(shutter, percentage):
    ip = getshuttername(shutter)
    print(ip,shutter,percentage)


    

    