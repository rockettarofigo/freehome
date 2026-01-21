# FreeHome

FreeHome is an open source software to manage lights, blinds, TVs and surveillance cameras from a web interface or via APIs so can be manage from anything you like. The project is released under the GNU General Public License (GPLv3): you can use, modify, and distribute it freely, but you cannot make direct commercial profit from it. 


---

## Requirements

- Python 3.13.5
- [Uvicorn](https://www.uvicorn.org/) (`pip install uvicorn`)

---

## Installing the System Service 

To start FreeHome automatically when you start your system, use systemd: 

```bash
sudo cp freehome.service /etc/systemd/system/freehome.service
```

---

## File for you to be changed

To populate the host file with the Shellys, insert them on the json caller hosts.json by populating it on the correct section

Change the two arrays "shutterNames" & "lightNames" with your own

---

## Hardware required
```bash
Shelly 1 gen 3
Shelly plus 2PM 
```
---

## Current functions
on/off lights \
change channel on firestick tv \
camera traking 

---

## To Dos
shutters implementation \
microphone to cam \
speaker to cam

---

## APIs
To control a room, send a POST request to the following endpoint:
```bash
http://[IP OF THE SERVER]:8000/room

```

The request body must be a JSON object specifying the room name and the desired state:

```bash
{
  "room": "office",
  "onoff": "on"
}
```

Set "onoff" to "on" or "off" depending on the action you want to perform.

