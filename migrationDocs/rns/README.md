# Setup RNS
## Prereqs
- install python venv with `sudo apt install python3.13-venv -y`
- The `www` group needs to exist for the github webhooks service to update services. RNS users should have this as their secondary group. test for it's existance, create if it doesnt exist yet. `grep -q -E "^www:" /etc/group || sudo groupadd www`
- Create an `rns` group `grep -q -E "^rns:" /etc/group || sudo groupadd rns`
- Create an rnsd user with a home dir in /opt/rns `sudo useradd -G rns,www -md /opt/rnsd -s /bin/bash rnsd` 
- switch over to the rnsd user sudo -iu rnsd
- create an rns venv `python3 -m venv reticulum.venv`
- add the venv activation to bashrc so it automatically starts when switching user to rnsd `echo ". /opt/rnsd/reticulum.venv/bin/activate" >> .bashrc`
- As the rns user, copy `~/.reticulum ~/.nomadnetwork .lxmd` over from the source server `ssh rnsuser@source "tar -zcvf - .lxmd .nomadnetwork .reticulum" | tar -zxvf -` - there are a lot of little files here, so a straight scp would take forever.
## RNSd
- switch over to the rnsd user sudo -iu rnsd
- install/upgrade rns, lxmf, nomadnet `pip install -U rns lxmf nomadnet`
- edit ~/.reticulum/config and fix any interfaces that might be wrong (ipvi4/6 addresses, yggdrasil addresses, etc).
- copy the systemd file from this dir to /etc/systemd/system/rnsd.service `sudo cp rnsd.service /etc/systemd/system/`
- start/enable the service `sudo systemctl start rnsd && sudo systemctl enable rnsd`

## LXMd
- copy the systemd file from this dir to /etc/systemd/system/lxmd.service `sudo cp lxmd.service /etc/systemd/system/`
- start/enable the service `sudo systemctl start lxmd && sudo systemctl enable lxmd`
## Nomadnet
- copy the systemd file from this dir to /etc/systemd/system/nomadnet.service `sudo cp nomadnet.service /etc/systemd/system/`
- start/enable the service `sudo systemctl start nomadnet && sudo systemctl enable nomadnet`
## Group Chat
- copy the config from the source machine `cd /opt/rnsd; ssh ynos@ynos.us "tar -zcvf - .config/fwdsvc" | tar -zxvf - `
- pull down the latest `wget https://github.com/thatSFguy/reticulum-group-chat/releases/download/v1.18.1/fwdsvc-linux-amd64 -O /opt/rnsd/fwdsv; chmod +x /opt/rnsd/fwdsvc`
- copy `reticulum-group-chat.service` to `/etc/systemd/system/` using `sudo cp reticulum-group-chat.service /etc/systemd/system/`
- start/enable the service `sudo systemctl start reticulum-group-chat && sudo systemctl enable reticulum-group-chat`
## NomadSearch
- copy the config from the source machine `cd /opt/rnsd/ ; ssh ynos@ynos.us "tar -zcvf - .nomadsearch" | tar -zxvf - `
- pull the latest nomadsearch `wget -O nomadsearch https://github.com/thatSFguy/reticulum-nomad-search/releases/download/v0.6.0/nomadsearch-v0.6.0-linux-amd64 ; chmod +x nomadsearch`
- copy the systemd file from this dir to /etc/systemd/system/nomadsearch.service `sudo cp nomadsearch.service /etc/systemd/system/`
- start/enable the service `sudo systemctl start nomadsearch && sudo systemctl enable nomadsearch`

