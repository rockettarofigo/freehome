from fastapi import APIRouter
from app.models import Things
from app.routers.lights import lightstatus
from app.routers.shutters import shutterstatus
import logging

router = APIRouter()

@router.post("/room")
def room_control(data: Things):
    logging.info("room: %s, OnOff: %s", data.room, data.onoff)
    lightstatus(data.room, data.onoff)
    return {"status": "ok"}

@router.post("/shutter")
def shutter_control(data: Things):
    logging.info("room: %s, shutter: %s, percentage: %s", data.room, data.shutter, data.percentage)
    shutterstatus(data.room, data.shutter, data.percentage)
    return {"status": "ok"}
