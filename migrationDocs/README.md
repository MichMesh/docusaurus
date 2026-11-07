# Migration notes

## linode shell
- `sudo snap install linode-cli`
### get a list of domains
- `sudo linode-cli domains list`
### list entries for the domain michmesh.org
- `sudo linode-cli domains records-list 3449077`

## RNS
### for any RNS admin, you should switch over to the user `rnsd`
This will make sure all the env vars are loaded and file perms are setup correctly.
- `sudo -iu rnsd`


## Firewall rules
allow http  
- `sudo ufw allow http`
- `sudo ufw allow 443/tcp`
Allow MQTT  
- `sudo ufw allow 1883/tcp`
- `sudo ufw allow 8883/tcp`
Allow RNS  
- `sudo ufw allow 7822/tcp`
- `sudo ufw allow 7823/tcp`


