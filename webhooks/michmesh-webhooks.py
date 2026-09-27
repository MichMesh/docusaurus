from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/michmesh-webhook', methods=['POST'])
def webhook():
    if request.method == 'POST':
        # Run any script on trigger
        subprocess.Popen(['/bin/bash', '/var/www/MichMesh/webhooks/deploy.sh'])
        return 'Webhook received and script triggered', 200
    return 'Invalid method', 400
