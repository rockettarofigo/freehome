from fastapi import APIRouter
from app.models import Things
from app.routers.hosts import getname, addname, getdeviceslist, deletedevice
import logging
import requests

router = APIRouter()

###                                      ###
#       API to triggher the devices        #
###                                      ###

@router.post("/light")
def room_control(data: Things):
    logging.info("light: %s, OnOff: %s", data.light, data.onoff)
    ip = getname("light", data.light)
    url = f"http://{ip}/relay/0?turn={data.onoff}"
    try:
        r = requests.get(url, timeout=3)
        r.raise_for_status()
        return {
            "status": "ok",
            "device_url": url
        }
    except requests.RequestException as e:
        logging.error(e)
        return {
            "status": "error",
            "message": str(e)
        }
        
        

@router.post("/shutter")
def shutter_control(data: Things):
    logging.info("shutter: %s, percentage: %s", data.shutter, data.percentage)
    ip = getname("shutter",data.shutter)
    url = f"http://{ip}/rpc/Shutter.Set"
    print(url)
#    payload = {
#        "id": 0,
#        "go_to_target": "true",
#        "target": data.percentage
#    }
#    try:
#        r = requests.post(url, json=payload, timeout=3)
#        r.raise_for_status()
#        return {
#            "status": "ok",
#            "device_url": url
#        }
#    except requests.RequestException as e:
#        logging.error(e)
#        return {
#            "status": "error",
#            "message": str(e)
#        }

###                                      ###
#            insert new devices            #
###                                      ###
@router.post("/newdevice")
def room_control(data: Things):
    logging.info("light: %s, shutter: %s, ip: %s, channel: %s", data.light, data.shutter, data.ip, data.channel)
    newdevice = addname(data.light, data.shutter, data.ip, data.tv)


###                                      ###
#            get list of device            #
###                                      ###
@router.post("/getdeviceslist")
def room_control(data: Things):
    logging.info("light: %s, shutter: %s, tv: %s", data.light, data.shutter, data.tv)
    devices = getdeviceslist(data.light, data.shutter, data.tv)
    return devices


###                                      ###
#            delete device                 #
###                                      ###
@router.post("/deletedevice")
def room_control(data: Things):
    logging.info("light: %s, shutter: %s, tv: %s", data.light, data.shutter, data.tv)
    devices = deletedevice(data.light, data.shutter, data.tv)
    return devices
