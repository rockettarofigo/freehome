import subprocess
import time
import logging

ADB_PATH = "/usr/bin/adb"  

logging.basicConfig(level=logging.INFO)


def connection():
    subprocess.run([ADB_PATH, "adb", "connect", "firestick:5555"], check=True)

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
