We need a way for github to call back to the michmesh server, letting us know we need to do a git pull. This is that.
- make a venv `python -m venv venv-webhook`
- activate it `. venv-webhook/bin/activate`
- install the prereqs `pip install flask gunicorn`
- copy `michmesh-webhook.service` into the systemd services dir - `cp michmesh-webhook.service /etc/systemd/system/`
- start the service to make sure it works - `sudo systemctl start michmesh-webhook` 
- enable the service to run on next boot - `sudo systemctl enable michmesh-webhook`
- add the following to nginx.conf
```
 location /michmesh-webhook {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
```

## Deploys

GitHub's webhook fires on every push. The listener pulls only for pushes to `master`, and the publish workflow commits the rebuilt `build/` to `master` after each merge, so the site updates without anyone logging in. `deploy.sh` pulls fast-forward only: if the checkout has local edits (`git status` in `/var/www/MichMesh`), the pull stops instead of merging, so don't edit files there by hand.

After changing the listener, restart it to load the new code: `sudo systemctl restart michmesh-webhook`.

## Signature check (recommended)

Without a secret, anyone who finds the URL can make the server pull. With one, the listener refuses any request GitHub didn't sign. Do these in order, so deploys never stop:

1. Generate a secret: `openssl rand -hex 32`
2. On GitHub, open the repo's **Settings → Webhooks**, edit the michmesh-webhook hook, paste the secret into **Secret**, and save. The listener keeps accepting requests while it has no secret of its own.
3. On the server, save it where only root can read it, then restart the listener:
   ```
   echo 'WEBHOOK_SECRET=<the secret>' | sudo tee /etc/michmesh-webhook.env >/dev/null
   sudo chmod 600 /etc/michmesh-webhook.env
   sudo cp /var/www/MichMesh/webhooks/michmesh-webhook.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl restart michmesh-webhook
   ```
4. Check: on GitHub, **Recent Deliveries → Redeliver** the last push. It should answer `Deploying` (or `Ignored push to …` for other branches). A `403 Bad signature` means the two secrets differ.

The listener reads the payload whether the webhook's content type is `application/x-www-form-urlencoded` (the current setting) or `application/json`.

