# Web setup
## Nginx setup
- install nginx `sudo apt install nginx 
- copy the supplied michmesh.conf - this is just the HTTP version, certbot will setup the https side.
- test nginx config with `sudo nginx -t`
- enable/restart nginx with `sudo systemctl enable nginx && sudo systemctl restart nginx` - Normally you will only need to run `sudo systemctl reload nginx` after making config changes.
## Grab the docusaurus repo
Will need something to serve, so let's start with this
- `cd /var/www ; sudo git clone https://github.com/MichMesh/docusaurus.git michmesh`
- `sudo chgrp -R www michmesh`
- ` sudo chmod -g+w michmesh`
## Setup LetsEncrypt
- switch to root `sudo -i` 
- create a python venv `python3 -m venv venv`
- load the venv `. venv/bin/activate`
- install certbot `pip install certbot`certbot-dns-linode`
- create a linode credentials file with the token in it at `~/.secrets/certbot/linode.ini`
- create the certs `certbot certonly --dns-linode --dns-linode-credentials ~/.secrets/certbot/linode.ini -d "*.michmesh.net" -d "michmesh.net" -d "*.michmesh.com" -d "michmesh.com" -d "*.michmesh.org" -d "michmesh.org"`
- test that it works by running a cert renewel dry run `certbot renew --dry-run`
- create a cron job that will renew the cert `crontab -e` and insert `0 3 * * * /root/venv/bin/certbot renew --quiet 2>&1/dev/null` on the bottom.



