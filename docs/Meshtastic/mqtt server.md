# Installation and configuration of the Mosquitto MQTT server
This is based on a debian install, ubuntu should be similar.
- `sudo apt install mosquitto`
- `sudo vim /etc/mosquitto/mosquitto.conf`
```
pid_file /run/mosquitto/mosquitto.pid

log_dest topic
log_type information
log_type subscribe
log_type unsubscribe

acl_file /etc/mosquitto/aclfile.conf

listener 8883
cafile /etc/letsencrypt/live/ynos.us-0001/chain.pem
keyfile /etc/letsencrypt/live/ynos.us-0001/privkey.pem
certfile /etc/letsencrypt/live/ynos.us-0001/cert.pem


listener 1883
allow_anonymous  false
password_file /etc/mosquitto/passwd

connection me-to-mesh
address mqtt.meshtastic.org:1883
remote_username meshdev
remote_password large4cats
topic msh/US/MI/# both

connection me-to-liam
address mqtt.meshtastic.liamcottle.net:1883
remote_username uplink
remote_password uplink
topic msh/US/MI out
```
- `sudo vim /etc/mosquitto/aclfile.conf`
```
# This affects access control for clients with no username.
topic read $SYS/#

# This only affects clients with username "testuser".
user testuser
topic readwrite test/#
#topic read $SYS/#

user meshdev
topic readwrite msh/#
topic read $SYS/#

# This affects all clients.
pattern write $SYS/broker/connection/%c/state
```
- `sudo mosquitto_passwd -c meshdev /etc/mosquitto/passwd`  

password: large4cats
- `sudo systemctl enable mosquitto`
- `sudo systemctl restart mosquitto`

You will have to do a bit of a permissions dance to get certs working. I have it running with a letsencrypt cert, this is what I had to do.
- create a group called `certreader`
- change the group ownership of the /etc/letsencrypt/archive/ to certreader
`sudo chgrp -R certreader /etc/letsencrypt/archive/$YOURCERTDIR`
