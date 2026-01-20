from fastapi import APIRouter
from app.models import Things
from app.routers.media import kodi, netflix, disney, connection
import logging

router = APIRouter()

@router.post("/tv")
def tv_control(data: Things):
    logging.info("TV channel: %s", data.channel)
    
    connection()
    
    if data.channel == "netflix":
        netflix()
    elif data.channel == "kodi":
        kodi()
    elif data.channel == "disney":
        disney()
    else:
        logging.info("TV channel: %s", data.channel)
    
    return {"status": "ok", "channel": data.channel}
