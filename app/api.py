import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import devices, tv, camera, pages
from app.routers import devices

app = FastAPI(title="SmartHome API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

app.include_router(tv.router)
app.include_router(devices.router)
app.include_router(camera.router)
app.include_router(pages.router)
app.include_router(devices.router)
