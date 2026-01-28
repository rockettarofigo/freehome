from pydantic import BaseModel
from typing import Optional

class Things(BaseModel):
    room: Optional[str] = None
    ip: Optional[str] = None
    light: Optional[str] = None   # name of the light
    shutter: Optional[str] = None # name of the shutter
    onoff: Optional[str] = None
    percentage: Optional[int] = None
    channel: Optional[str] = None
    tv: Optional[str] = None
    startstop: Optional[str] = None
