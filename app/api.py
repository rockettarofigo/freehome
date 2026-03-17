import os
import mimetypes
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.routers import devices, tv, camera

app = FastAPI(title="SmartHome API")

# -------------------------
# CORS configuration
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Ensure correct MIME types
# -------------------------
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ANGULAR_DIR = os.path.join(BASE_DIR, "static", "angular")
STATIC_DIR = os.path.join(BASE_DIR, "static")

# -------------------------
# Angular SPA handler (CRITICAL)
# This handles both:
# - real static files (js, css, images)
# - Angular client-side routes (fallback to index.html)
# -------------------------
@app.get("/static/angular/{full_path:path}")
def serve_angular(full_path: str):
    file_path = os.path.join(ANGULAR_DIR, full_path)

    # Serve actual files if they exist
    if os.path.exists(file_path) and not os.path.isdir(file_path):
        return FileResponse(file_path)

    # Fallback to index.html for Angular routing
    return FileResponse(os.path.join(ANGULAR_DIR, "index.html"))

# -------------------------
# Generic static files (manifest, images, etc.)
# -------------------------
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# -------------------------
# Clean entry points (optional)
# Allow accessing Angular app without /static/angular prefix
# -------------------------
@app.get("/")
@app.get("/dashboard")
@app.get("/light")
@app.get("/shutter")
@app.get("/tv")
@app.get("/cams")
@app.get("/solar")
@app.get("/aircon")
@app.get("/settings")
def serve_root():
    return FileResponse(os.path.join(ANGULAR_DIR, "index.html"))

# -------------------------
# PWA related files
# -------------------------
@app.get("/manifest.json")
def serve_manifest():
    return FileResponse(os.path.join(STATIC_DIR, "manifest.json"))

# NOTE:
# Angular PWA uses ngsw-worker.js automatically.
# No need to manually expose sw.js unless you know what you're doing.

# -------------------------
# API routers
# -------------------------
app.include_router(tv.router)
app.include_router(devices.router)
app.include_router(camera.router)