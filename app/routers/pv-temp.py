from pymodbus.client import ModbusTcpClient
import ctypes


# Configurazione inverter
IP = "192.168.0.24"
PORT = 502
DEVICE_ID = 1

# Registri Modbus
REG_ACTIVE_POWER      = 37113   # Active power I32
REG_DAILY_YIELD       = 32114   # Daily energy produced U32
REG_DAILY_IMPORT      = 32118   # Daily energy imported U32
REG_NUM_PV_STR        = 30071   # Number of PV strings U16
REG_BATTERY_SOC_REAL   = 38229  # SOC reale batteria UINT16
ALARM_REGISTERS        = [32008, 32009, 32010]  # Registri allarmi
COUNT_32BIT = 2  # due registri consecutivi per 32-bit

# Dizionario allarmi basato su datasheet
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

# Connetti al Modbus TCP
client = ModbusTcpClient(IP, port=PORT)
if not client.connect():
    print("❌ Connessione fallita")
    exit(1)

# --- Potenza attiva ---
r = client.read_holding_registers(address=REG_ACTIVE_POWER, count=COUNT_32BIT, device_id=DEVICE_ID)
if not r.isError():
    high, low = r.registers
    raw = (high << 16) + low
    signed_raw = ctypes.c_int32(raw).value
    active_power_kw = signed_raw / 1000.0
    print(f"⚡ Potenza attiva: {active_power_kw:.3f} kW")
    if active_power_kw < 0:
        print(f"📉 Stai consumando: {abs(active_power_kw):.3f} kW dalla rete")
else:
    print("❌ Errore lettura Active Power")

# --- Energia giornaliera prodotta ---
r2 = client.read_holding_registers(address=REG_DAILY_YIELD, count=COUNT_32BIT, device_id=DEVICE_ID)
if not r2.isError():
    high, low = r2.registers
    raw_daily = (high << 16) + low
    daily_kwh = raw_daily / 100.0
    print(f"📈 Energia giornaliera prodotta: {daily_kwh:.2f} kWh")
else:
    print("❌ Errore lettura Daily Energy Yield")

# --- Energia giornaliera consumata ---
r3 = client.read_holding_registers(address=REG_DAILY_IMPORT, count=COUNT_32BIT, device_id=DEVICE_ID)
if not r3.isError():
    high, low = r3.registers
    raw_import = (high << 16) + low
    daily_import_kwh = raw_import / 100.0
    print(f"📉 Energia giornaliera consumata: {daily_import_kwh:.2f} kWh")
else:
    print("❌ Errore lettura Daily Energy Import")

# --- Numero di stringhe PV ---
r4 = client.read_holding_registers(address=REG_NUM_PV_STR, count=1, device_id=DEVICE_ID)
if not r4.isError():
    num_strings = r4.registers[0]
    print(f"🔋 Numero di stringhe PV: {num_strings}")
else:
    print("❌ Errore lettura Number of PV strings")

# --- SOC reale batteria ---
r5 = client.read_holding_registers(address=REG_BATTERY_SOC_REAL, count=1, device_id=DEVICE_ID)
if not r5.isError():
    soc_raw = r5.registers[0]
    soc_percent = soc_raw / 10.0
    print(f"🔋 SOC reale batteria: {soc_percent:.1f}%")
else:
    print("❌ Errore lettura SOC reale batteria")

# --- Allarmi ---
print("🚨 Allarmi attivi:")
for addr in ALARM_REGISTERS:
    r_alarm = client.read_holding_registers(address=addr, count=1, device_id=DEVICE_ID)
    if not r_alarm.isError():
        val = r_alarm.registers[0]
        if val == 0:
            print(f"Registro {addr}: Nessun allarme")
        else:
            print(f"Registro {addr}: 0x{val:04X}")
            for bit in range(16):
                if val & (1 << bit):
                    msg = ALARM_BITS.get(addr, {}).get(bit, f"Allarme sconosciuto bit {bit}")
                    print(f"    ⚠️ {msg}")
    else:
        print(f"❌ Errore lettura registro allarmi {addr}")

client.close()