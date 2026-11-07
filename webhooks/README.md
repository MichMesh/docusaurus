We need a way for github to call back to the michmesh server, letting us know we need to do a git pull. This is that.
- make a venv `python -m venv venv-webhook`
- activate it `. venv-webhook/bin/activate`
- install the prereqs `pip install -Ur requirements.txt`
- copy `service`multiwebhooks.service` into the systemd services dir - `cp michmesh-webhook.service /etc/systemd/system/`
- start the service to make sure it works - `sudo systemctl start multiwebhooks.service` 
- enable the service to run on next boot - `sudo systemctl enable multiwebhooks.service`
- add the following to nginx.conf
```
 location /webhooks {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
```

## Deploys

GitHub's webhook fires on every push. The listener pulls only for pushes to `master`, and the publish workflow commits the rebuilt `build/` to `master` after each merge, so the site updates without anyone logging in. Script runs a `git pull` in `/var/www/MichMesh`), the pull stops instead of merging, so don't edit files there by hand.

After changing the listener, restart it to load the new code: `sudo systemctl restart multiwebhooks`.

