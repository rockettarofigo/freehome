from fastapi import APIRouter
from app.models import Things
from app.routers.devices import light_control,shutter_control
import requests
import json

router = APIRouter()

###                                      ###
#       API to triggher the scenes         #
###                                      ###

@router.post("/scene")
def scene_control(data: Things):
    import json

    # Split strings to handle multiple devices
    lights = data.light.split(',') if data.light else []
    shutters = data.shutter.split(',') if data.shutter else []
    onoffs = data.onoff.split(',') if data.onoff else []

    # Print the original JSON for debugging
    print("Original data:")
    print(json.dumps(data.dict(), indent=2))

    results = []

    # Iterate over lights
    for i, light_name in enumerate(lights):
        # Get the corresponding on/off state if it exists, otherwise default to 'off'
        onoff_state = onoffs[i] if i < len(onoffs) else 'off'
        light_data = Things(light=light_name.strip(), onoff=onoff_state)
        result = light_control(light_data)
        results.append(result)

    # Iterate over shutters
    for i, shutter_name in enumerate(shutters):
        # Use the percentage from input if provided, otherwise default to 0%
        percent = data.percentage if data.percentage is not None else 0
        shutter_data = Things(shutter=shutter_name.strip(), percentage=percent)
        result = shutter_control(shutter_data)
        results.append(result)

    # Return a list of results for all devices
    return results