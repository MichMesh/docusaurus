from flask import Flask, request
#from typing import Dict, Any
from datetime import datetime
import git,  subprocess, json, logging

app = Flask(__name__)

def writefile(inputDict,repo):
  isotime = datetime.now().isoformat()
  filename = "/tmp/" + repo.replace("/","-") +"-" + isotime + ".json"
  with open(filename, 'w', encoding='utf-8') as f:
    json.dump(inputDict, f, ensure_ascii=False, indent=4)

## To add another webhook, add a new a new elif statement like below.
def webhook_parser(inputDict):
  outputline = "webhook from repository/full_name: " + inputDict["repository"]["full_name"]
  subprocess.Popen(['/usr/bin/echo', outputline])
  ## figure out which repo we were given
  if inputDict["repository"]["full_name"]   == "MichMesh/docusaurus":
    writefile(inputDict,inputDict["repository"]["full_name"])
    outputline = "pulling repo for: " + inputDict["repository"]["full_name"]
    subprocess.Popen(['/usr/bin/echo', outputline])
    #subprocess.Popen(['/bin/bash', '/var/www/michmesh/webhooks/docusaurus.sh'])
    repo = git.Repo("/var/www/michmesh/")
    # blow away any local changes so the pull doesnt poop out.
    repo.git.reset('--hard')
    origin = repo.remotes.origin
    origin.pull()
    return 'Webhook received and script triggered', 200
  elif inputDict["repository"]["full_name"]   == "MichMesh/NomadPages":
    writefile(inputDict,inputDict["repository"]["full_name"])
    #subprocess.Popen(["sudo", "-u", "rnsd", "/opt/rnsd/updateNomadnet"])
    origin = git.cmd.Git("/opt/rnsd/.nomadnetwork/storage/pages")
    origin.pull
    return 'NomadPages Webhook received and pages pulled', 200
  elif inputDict["repository"]["full_name"]   == "thatSFguy/reticulum-group-chat" and inputDict["action"] == "completed":
    writefile(inputDict,inputDict["repository"]["full_name"])
    if 'workflow_run' in inputDict:
      outputline = "fetching new group chat and restarting service" 
      subprocess.Popen(['/usr/bin/echo', outputline])
      subprocess.Popen(["sudo", "-u", "rnsd", "/opt/rnsd/get-latest-fwdsvc"])
      subprocess.Popen(["sudo", "/usr/bin/systemctl", "restart", "reticulum-group-chat"])
      return 'rns fwdsvc Webhook queued ', 200
    return 'no fwdsvc deploy needed ', 200

  else:
    writefile(inputDict,inputDict["repository"]["full_name"])
    outputline = "unknown repository/full_name: " + inputDict["repository"]["full_name"]
    subprocess.Popen(['/usr/bin/echo', outputline])
    return 'unknown webhook name', 404 


@app.route('/webhooks', methods=['POST'])

def default_route():
  """Default route"""
  if request.method == 'POST':
    return webhook_parser(request.json)


