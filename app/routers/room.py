from fastapi import APIRouter
from app.models import Things
from app.routers.lights import statoluce
from app.routers.shutters import shutter
import logging

router = APIRouter()

@router.post("/room")
def room_control(dati: Things):
    logging.info("room: %s, OnOff: %s", dati.room, dati.onoff)
    statoluce(dati.room, dati.onoff)
    return {"status": "ok"}

@router.post("/shutter")
def shutter_control(dati: Things):
    logging.info("room: %s, shutter: %s, percentage: %s", dati.room, dati.shutter, dati.percentage)
    shutter(dati.room, dati.shutter, dati.percentage)
    return {"status": "ok"}
