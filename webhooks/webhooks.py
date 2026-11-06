from flask import Flask, request
from typing import Dict, Any
import subprocess

app = Flask(__name__)

@app.route('/michmesh-webhook', methods=['POST'])

def docusaurus_updated():
  subprocess.Popen(['/bin/bash', '/var/www/MichMesh/webhooks/deploy.sh'])
  return 'Webhook received and script triggered', 200

def app_updated():
    return 'Nothing defined',404

def webhook_parser(inputDict):
  ## figure out which repo we were given
  if inputDict["repository"]["full_name"] == "MichMesh/docusaurus":
    docusaurus_updated()
  if inputDict["repository"]["full_name"] == "otherOrg-com/app":
    app_updated()

def webhook(inputDict: Dict[Any, Any]):
  if request.method == 'POST':
    return webhook_parser(inputDict)
