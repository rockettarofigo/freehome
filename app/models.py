from pydantic import BaseModel
from typing import Optional

class Things(BaseModel):
    stanza: Optional[str] = None
    onoff: Optional[str] = None
    finestra: Optional[str] = None
    percentuale: Optional[str] = None
    channel: Optional[str] = None
