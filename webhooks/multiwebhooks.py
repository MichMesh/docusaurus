from flask import Flask, request
#from typing import Dict, Any
import git 
import subprocess, json, logging

app = Flask(__name__)

## To add another webhook, add a new a new elif statement like below.
def webhook_parser(inputDict):
  ## figure out which repo we were given
  if inputDict["repository"]["full_name"]   == "MichMesh/docusaurus":
    #subprocess.Popen(['/bin/bash', '/var/www/michmesh/webhooks/docusaurus.sh'])
    repo = git.Repo("/var/www/michmesh/")
    origin = repo.remotes.origin
    origin.pull()
    subprocess.Popen(["sudo", "-u", "rnsd", "/opt/rnsd/updateNomadnet"])
    return 'Webhook received and script triggered', 200
  elif inputDict["repository"]["full_name"]   == "MichMesh/NomadPages":
    origin = git.cmd.Git("/opt/rnsd/.nomadnetwork/storage/pages")
    origin.pull
    return 'NomadPages Webhook received and pages pulled', 200
  elif inputDict["repository"]["full_name"]   == "thatSFguy/reticulum-group-chat":
    subprocess.Popen(["sudo", "-u", "rnsd", "/opt/rnsd/get-latest-fwdsvc"])
    subprocess.Popen(["sudo", "/usr/bin/systemctl", "restart", "reticulum-group-chat"])
    return 'rns fwdsvc Webhook received and binary pulled', 200

  else:
    outputline = "unknown repository/full_name: " + inputDict["repository"]["full_name"]
    subprocess.Popen(['/usr/bin/echo', outputline])
    return 'unknown webhook name', 404 


@app.route('/webhooks', methods=['POST'])

def default_route():
  """Default route"""
  if request.method == 'POST':
    return webhook_parser(request.json)


