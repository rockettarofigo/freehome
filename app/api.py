import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import tv, room, camera, pages, adddevices

app = FastAPI(title="SmartHome API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

app.include_router(tv.router)
app.include_router(room.router)
app.include_router(camera.router)
app.include_router(pages.router)
app.include_router(adddevices.router)
