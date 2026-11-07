from flask import Flask, request
from typing import Dict, Any
import subprocess, json

## when debugging, change this to true
webhooksDebug = True

app = Flask(__name__)

@app.route('/michmesh-webhook', methods=['POST'])

## to add a new webhook, add a new function like below and a new elif down in the webhook_parser
def app_updated():
  subprocess.Popen(['/bin/bash', '/var/www/michmesh/webhooks/newApp.sh'])
  return 'Nothing defined',404

def docusaurus_updated():
  subprocess.Popen(['/bin/bash', '/var/www/michmesh/webhooks/docusaurus.sh'])
  return 'Webhook received and script triggered', 200

## To add another webhook, add a new app function above and an elif statement like below.
def webhook_parser(inputDict):
  if webhooksDebug:
    with open("/tmp/webhookDebug.json", "w") as webhookDataFile:
      # magic happens here to make it pretty-printed
      webhookDataFile.write(
        json.dumps(inputDict, indent=2, sort_keys=True)
      )

  ## figure out which repo we were given
  if inputDict["repository"]["full_name"] == "MichMesh/docusaurus":
    return docusaurus_updated()
  elif inputDict["repository"]["full_name"] == "otherOrg-com/app":
    return app_updated()
  else:
    return 

def webhook(inputDict: Dict[Any, Any]):
  if request.method == 'POST':
    return webhook_parser(inputDict)
