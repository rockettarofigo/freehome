from typing import Optional
from pydantic import BaseModel, validator

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

class PvModel(BaseModel):
    reg_active_power: Optional[int] = None
    reg_daily_yield: Optional[int] = None
    reg_daily_import: Optional[int] = None
    reg_num_pv_str: Optional[int] = None
    reg_battery_soc_real: Optional[int] = None
    alarm_registers: Optional[int] = None
    count_32bit: Optional[int] = None
    
    active_power: Optional[int] = None
    daily_yield: Optional[int] = None
    daily_import: Optional[int] = None #used energy
    num_pv_str: Optional[int] = None
    battery_soc_real: Optional[int] = None    
    
    # Validator per trasformare stringhe vuote in None
    @validator("*", pre=True)
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v