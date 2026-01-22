from fastapi import APIRouter
from app.models import Things
import logging

router = APIRouter()

@router.post("/adddevices")
def device_control(data: Things):
    logging.info("ip: %s, name: %s", data.ip, data.light)
    return "ok"    
