from pymodbus.client import ModbusTcpClient
from fastapi import APIRouter
from app.models import PvModel
import logging
import ctypes

# Inverter configuration
IP = "192.168.0.10"
PORT = 502
DEVICE_ID = 1



# Modbus registers
REG_ACTIVE_POWER      = 37113
REG_DAILY_YIELD       = 32106 #32114
REG_DAILY_IMPORT      = 32118 
REG_NUM_PV_STR        = 30071
REG_BATTERY_SOC_REAL   = 38229
ALARM_REGISTERS        = [32008, 32009, 32010]
COUNT_32BIT = 2

# Alarm dictionary based on datasheet
ALARM_BITS = {
    32008: {
        0: "Overvoltage DC",
        1: "Undervoltage DC",
        2: "Overtemperature inverter",
        3: "Inverter fault",
        4: "AC overcurrent",
        5: "Fuse fault",
        6: "Relay fault",
        7: "Communication fault"
    },
    32009: {
        0: "Ground fault",
        1: "PV mismatch",
        2: "Anti-islanding fault"
    },
    32010: {
        0: "Battery fault",
        1: "Battery overvoltage",
        2: "Battery undervoltage"
    }
}

router = APIRouter()
logging.basicConfig(level=logging.INFO)

@router.post("/pv")
def tv_control(data: PvModel):
    json_string = {
        "active_power": 0,
        "daily_kwh": 0,
        "daily_import_kwh": 0,
        "num_strings": 0,
        "soc_percent": 0,
        "alarms": []
    }

    client = ModbusTcpClient(IP, port=PORT)
    if not client.connect():
        logging.info("Connection failed")
        return {"error": "Connection failed", **json_string}
        
    # --- Active power ---
    r = client.read_holding_registers(address=REG_ACTIVE_POWER, count=COUNT_32BIT, device_id=DEVICE_ID)
    if not r.isError():
        high, low = r.registers
        raw = (high << 16) + low
        signed_raw = ctypes.c_int32(raw).value
        json_string["active_power"] = signed_raw / 1000.0

    # --- Daily energy produced ---
    r2 = client.read_holding_registers(address=REG_DAILY_YIELD, count=COUNT_32BIT, device_id=DEVICE_ID)
    if not r2.isError():
        high, low = r2.registers
        json_string["daily_kwh"] = ((high << 16) + low) / 100.0

    # --- Daily energy imported ---
    r3 = client.read_holding_registers(address=REG_DAILY_IMPORT, count=COUNT_32BIT, device_id=DEVICE_ID)
    if not r3.isError():
        high, low = r3.registers
        json_string["daily_import_kwh"] = ((high << 16) + low) / 100.0

    # --- Number of PV strings ---
    r4 = client.read_holding_registers(address=REG_NUM_PV_STR, count=1, device_id=DEVICE_ID)
    if not r4.isError():
        json_string["num_strings"] = r4.registers[0]

    # --- Battery real SOC ---
    r5 = client.read_holding_registers(address=REG_BATTERY_SOC_REAL, count=1, device_id=DEVICE_ID)
    if not r5.isError():
        json_string["soc_percent"] = r5.registers[0] / 10.0

    # --- Alarms ---
    alarms = []
    for addr in ALARM_REGISTERS:
        r_alarm = client.read_holding_registers(address=addr, count=1, device_id=DEVICE_ID)
        if not r_alarm.isError():
            val = r_alarm.registers[0]
            for bit in range(16):
                if val & (1 << bit):
                    msg = ALARM_BITS.get(addr, {}).get(bit, f"Unknown alarm bit {bit}")
                    alarms.append(msg)
    json_string["alarms"] = alarms

    client.close()
    return json_string