import os
import mimetypes
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.routers import devices, tv, camera

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SmartHome API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure JS files have correct MIME type
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

@app.get("/")
@app.get("/dashboard")
@app.get("/light")
@app.get("/shutter")
@app.get("/tv")
@app.get("/cams")
@app.get("/solar")
@app.get("/aircon")
@app.get("/settings")
def serve_angular():
    return FileResponse(os.path.join(BASE_DIR, "static", "angular", "index.html"))

app.include_router(tv.router)
app.include_router(devices.router)
app.include_router(camera.router)
app.include_router(devices.router)
