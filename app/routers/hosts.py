import json
import os

def gethostname(room):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "..", "hosts.json")

    with open(json_path, "r") as json_file:
        data = json.load(json_file)

    return data["rooms"].get(room)

def gettvhostname(iot):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "..", "hosts.json")

    with open(json_path, "r") as json_file:
        data = json.load(json_file)

    return data["tv"].get(iot)

def getshuttername(shutter):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "..", "hosts.json")

    with open(json_path, "r") as json_file:
        data = json.load(json_file)

    return data["shutters"].get(shutter)