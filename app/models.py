from pydantic import BaseModel
from typing import Optional

class Things(BaseModel):
    room: Optional[str] = None
    onoff: Optional[str] = None
    shutter: Optional[str] = None
    percentage: Optional[str] = None
    channel: Optional[str] = None
