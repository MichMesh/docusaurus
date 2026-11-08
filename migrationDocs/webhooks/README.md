# Webhooks
After you get the web server stood up, you will want something to do a git pull on the docusaurus dir to keep things up to date. This will need a manual restart if any updates are made to the webhooks service.
## setup
- create a user that belongs to the www group with a shell set to /bin/flase `sudo useradd -g www -s /bin/false webhooks`
- cd into the docusaurus/webhooks dir and create a venv `python -m venv venv-webhook`
- check that the user and path for the webhooks user and app are right in the service file
- load the venv `. venv-webhook/bin/activate`
- install the reqs `pip install -r requirements.txt`
- copy multiwebhooks.service to systemd `sudo cp multiwebhooks.service /etc/systemd/system/`
- enable/start the services `sudo systemctl start multiwebhooks; sudo systemctl enable multiwebhooks`

## testing
Included are a few json files for testing the webhooks service. Here is an example of how to use them.  
- trigger a docusaurus pull `curl -vX POST https://new.michmesh.net/webhooks -d @docusaurus-webhook.json --header "Content-Type: application/json" 
- trigger a NomadNet pull `curl -vX POST https://new.michmesh.net/webhooks -d @NomadNetPages-webhook.json --header "Content-Type: application/json" 
- A file with an unknown repo to make sure we're not triggering on anything we shouldnt.  `curl -vX POST https://new.michmesh.net/webhooks -d @bad-webhook.json --header "Content-Type: application/json"`


