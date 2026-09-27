We need a way for github to call back to the michmesh server, letting us know we need to do a git pull. This is that.
- make a venv `python -m venv venv-webhook`
- activate it `. venv-webhook/bin/activate`
- install the prereqs `pip install flask gunicorn`
- copy `michmesh-webhook.service` into the systemd services dir - `cp michmesh-webhook.service /etc/systemd/system/`
- start the service to make sure it works - `sudo systemctl start michmesh-webhook` 
- enable the service to run on next boot - `sudo systemctl enable michmesh-webhook`


