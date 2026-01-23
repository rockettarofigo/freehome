from fastapi import APIRouter
from app.models import Things
from app.routers.hosts import getname
import logging
import subprocess
import time

ADB_PATH = "/usr/bin/adb"  

router = APIRouter()

logging.basicConfig(level=logging.INFO)

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




def connection():
    ip = getname("tv","firestick")
    subprocess.run([ADB_PATH, "connect", f"{ip}:5555"], check=True)


def kodi():
    try:
        subprocess.run([ADB_PATH, "shell", "monkey", "-p", "org.xbmc.kodi", "-c", "android.intent.category.LAUNCHER", "1"], check=True)
        time.sleep(2)
        for _ in range(4):
            subprocess.run([ADB_PATH, "shell", "input", "keyevent", "20"], check=True)
            time.sleep(0.2)
        subprocess.run([ADB_PATH, "shell", "input", "keyevent", "23"], check=True)
        logging.info("Kodi avviato")
    except subprocess.CalledProcessError as e:
        logging.error("Errore ADB Kodi: %s", e)

def netflix():
    try:
        subprocess.run([ADB_PATH, "shell", "monkey", "-p", "com.netflix.ninja", "1"], check=True)
        logging.info("Netflix inviato")
    except subprocess.CalledProcessError as e:
        logging.error("Errore ADB Netflix: %s", e)

def disney():
    try:
        subprocess.run([ADB_PATH, "shell", "monkey", "-p", "com.disney.disneyplus", "-c", "android.intent.category.LAUNCHER", "1"], check=True)
        logging.info("Disney inviato")
    except subprocess.CalledProcessError as e:
        logging.error("Errore ADB Disney: %s", e)
