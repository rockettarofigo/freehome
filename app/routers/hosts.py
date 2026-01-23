import json
import os

###                                 ###
#        Get devices name & ip        #
###                                 ###
def getname(device,light):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "..", "hosts.json")
    with open(json_path, "r") as json_file:
        data = json.load(json_file)
    return data[device].get(light)


###                                 ###
#            add devices              #
###                                 ###
def addname(light=None, shutter=None, ip=None, tv=None):

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "..", "hosts.json")
    
    with open(json_path, "r") as json_file:
        data = json.load(json_file)
    
    if light:
        data.setdefault("light", {})[light] = ip
    elif shutter:
        data.setdefault("shutter", {})[shutter] = ip
    elif tv:
        data.setdefault("tv", {})[tv] = ip
    else:
        return data, "nothing to add"
    
    with open(json_path, "w") as json_file:
        json.dump(data, json_file, indent=2)
        
    return data, "added"

###                                 ###
#          Get devices  name          #
###                                 ###
def getdeviceslist(light=None, shutter=None, tv=None):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "..", "hosts.json")
    
    with open(json_path, "r") as json_file:
        data = json.load(json_file)

    if light:
        return data.get("light", {})
    elif shutter:
        return data.get("shutter", {})
    elif tv:
        return data.get("tv", {})
    else:
        return {} 
    
###                                 ###
#           delete devices            #
###                                 ###
def deletedevice(light=None, shutter=None, ip=None, tv=None):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(BASE_DIR, "..", "hosts.json")
    
    with open(json_path, "r") as json_file:
        data = json.load(json_file)
    
    removed = False  

    if light:
        if "light" in data and light in data["light"]:
            del data["light"][light]
            removed = True
    elif shutter:
        if "shutter" in data and shutter in data["shutter"]:
            del data["shutter"][shutter]
            removed = True
    elif tv:
        if "tv" in data and tv in data["tv"]:
            del data["tv"][tv]
            removed = True
    else:
        return data, "nothing to remove"

    if removed:

        with open(json_path, "w") as json_file:
            json.dump(data, json_file, indent=2)
        return data, "removed"
    else:
        return data, "item not found"