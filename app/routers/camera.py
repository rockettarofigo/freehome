from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import cv2
import threading
import time
import numpy as np

router = APIRouter()

CAMERAS = {}
CAMERAS_LOCK = threading.Lock()

def get_difference(first_frame, second_frame):

    first_gray = cv2.cvtColor(first_frame, cv2.COLOR_BGR2GRAY)
    second_gray = cv2.cvtColor(second_frame, cv2.COLOR_BGR2GRAY)
    frame_diff = cv2.absdiff(first_gray, second_gray)

    _, thresh = cv2.threshold(frame_diff, 75, 255, cv2.THRESH_BINARY)
    kernel = np.ones((5, 5), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=2)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    min_x, min_y = float('inf'), float('inf')
    max_x, max_y = 0, 0    

    for contour in contours:
        if cv2.contourArea(contour) < 500:
            continue
        x, y, w, h = cv2.boundingRect(contour)
        min_x = min(min_x, x)
        min_y = min(min_y, y)
        max_x = max(max_x, x + w)
        max_y = max(max_y, y + h)

    annotated_frame = second_frame.copy()
    if max_x > 0 and max_y > 0:
        cv2.rectangle(annotated_frame, (min_x, min_y), (max_x, max_y), (0, 0, 255), 2)

    return annotated_frame

def capture_thread(cam_id):

    cam = CAMERAS[cam_id]["cap"]
    prev_frame = None

    while cam.isOpened():
        ret, frame = cam.read()
        if not ret:
            time.sleep(0.05)
            continue

        if prev_frame is None:
            prev_frame = frame
            time.sleep(0.03)
            continue

        annotated_frame = get_difference(prev_frame, frame)
        prev_frame = frame

        CAMERAS[cam_id]["frame_lock"].acquire()
        CAMERAS[cam_id]["frame"] = annotated_frame
        CAMERAS[cam_id]["frame_lock"].release()
        time.sleep(0.03)  # ~30 fps

def find_camera(cam_id):

    with CAMERAS_LOCK:
        if cam_id in CAMERAS:
            return CAMERAS[cam_id]

        cap = cv2.VideoCapture(cam_id)
        if not cap.isOpened():
            return None

        CAMERAS[cam_id] = {
            "cap": cap,
            "frame": None,
            "frame_lock": threading.Lock()
        }

        t = threading.Thread(target=capture_thread, args=(cam_id,), daemon=True)
        t.start()
        return CAMERAS[cam_id]

def generate_frames(cam_id):
    cam_data = CAMERAS.get(cam_id)
    if cam_data is None:
        return

    while True:
        cam_data["frame_lock"].acquire()
        frame = cam_data["frame"]
        cam_data["frame_lock"].release()

        if frame is None:
            time.sleep(0.05)
            continue

        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue

        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@router.get("/camera/{cam_id}")
def camera_control(cam_id: int):
    cam_data = find_camera(cam_id)
    if cam_data is None:
        return {"error": f"Camera {cam_id} not available"}
    return StreamingResponse(generate_frames(cam_id),
                             media_type='multipart/x-mixed-replace; boundary=frame')
