from fastapi import APIRouter
from app.models import Things
from app.routers.media import kodi, netflix, disney, connection
import logging

router = APIRouter()

@router.post("/tv")
def tv_control(dati: Things):
    logging.info("TV channel: %s", dati.channel)
    
    connection()
    
    if dati.channel == "netflix":
        netflix()
    elif dati.channel == "kodi":
        kodi()
    elif dati.channel == "disney":
        disney()
    else:
        logging.info("TV channel: %s", dati.channel)
    
    return {"status": "ok", "channel": dati.channel}
