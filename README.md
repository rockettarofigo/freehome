# FreeHome

FreeHome is an open source software to manage lights, blinds, TVs and surveillance cameras from a web interface. The project is released under the GNU General Public License (GPLv3): you can use, modify, and distribute it freely, but you cannot make direct commercial profit from it.

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

## Host file

To populate the host file with the Shellys, insert them on the json caller hosts.json by populating it on the correct section

## Hardware required
```bash
Shelly 1 gen 3
Shelly plus 2PM 
```