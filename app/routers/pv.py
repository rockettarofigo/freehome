from fastapi import APIRouter
from app.models import Things
import requests
import logging

router = APIRouter()

@router.post("/pv")
def fetch_pv(data: Things):
    url = "http://localhost:8001/pull/fetch/"

    payload = {
        "start": data.start,
        "end": data.end
    }

    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()

        logging.info(
            "status: %s, response: %s",
            response.status_code,
            response.text
        )

        return {
            "status": response.status_code,
            "response": response.json()
        }

    except requests.RequestException as e:
        logging.error("Request failed: %s", e)
        return {
            "status": "error",
            "message": str(e)
        }