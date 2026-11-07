# Mosquitto
## Installation
Install the package `sudo apt install mosquitto mosquitto-clients -y`

## fix the cert paths
- Create a certreader group `sudo groupadd certreader`
- Change the read perms on `/etc/letsencrypt/archive` so `certreader` users can read the certs. `sudo chmod -R g+rx /etc/letsencrypt/live/; sudo chmod g+rx /etc/letsencrypt/archive/; sudo chmod g+r /etc/letsencrypt/archive/michmesh.net/privkey1.pem` `sudo chgrp -R certreader /etc/letsencrypt/live/michmesh.net /etc/letsencrypt/archive/`
- add the user `mostquitto`to the `certreader` group. `sudo usermod -aG certreader mosquitto`

## setup the service
- Copy mosquitto.conf to /etc/mosquitto `sudo cp mosquitto/mosquitto.conf /etc/mosquitto/`
- Copy aclfile.conf to /etc/mosquitto `sudo cp mosquitto/aclfile.conf /etc/mosquitto/`
- Copy passwd to /etc/mosquitto `sudo cp mosquitto/passwd /etc/mosquitto/`
- Enable/start the service `sudo systemctl start mosquitto && sudo systemctl enable mosquitto`

## test that it's working
Use `mosquitto_client` or [MQTT-Explorer](https://mqtt-explorer.com/)
- `mosquitto_sub -t 'msh/#' -u meshdev -P large4cats -h new.michmesh.net`

