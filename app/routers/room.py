from fastapi import APIRouter
from app.models import Things
from app.routers.lights import statoluce
from app.routers.shutters import shutter
import logging

router = APIRouter()

@router.post("/room")
def room_control(dati: Things):
    logging.info("Stanza: %s, OnOff: %s", dati.stanza, dati.onoff)
    statoluce(dati.stanza, dati.onoff)
    return {"status": "ok"}

@router.post("/shutter")
def shutter_control(dati: Things):
    logging.info("Stanza: %s, Finestra: %s, Percentuale: %s", dati.stanza, dati.finestra, dati.percentuale)
    shutter(dati.stanza, dati.finestra, dati.percentuale)
    return {"status": "ok"}
