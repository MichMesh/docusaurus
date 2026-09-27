import hashlib
import hmac
import json
import os
import subprocess
from urllib.parse import parse_qs

from flask import Flask, request

app = Flask(__name__)

DEPLOY_SCRIPT = '/var/www/MichMesh/webhooks/deploy.sh'
DEPLOY_REF = 'refs/heads/master'

# The secret set on the GitHub webhook. Read from the environment (see
# README.md). While it's unset, requests are accepted unsigned so deploys keep
# working, with a warning in the log; once it's set, unsigned or wrongly
# signed requests are refused.
SECRET = os.environ.get('WEBHOOK_SECRET', '').encode()


def signature_ok(body):
    sent = request.headers.get('X-Hub-Signature-256', '')
    expected = 'sha256=' + hmac.new(SECRET, body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(sent, expected)


def pushed_ref(body):
    # GitHub sends JSON, or a form field named payload holding the JSON,
    # depending on the webhook's content type setting.
    text = body.decode('utf-8', 'replace')
    if request.mimetype == 'application/x-www-form-urlencoded':
        text = parse_qs(text).get('payload', ['{}'])[0]
    try:
        return json.loads(text).get('ref')
    except ValueError:
        return None


@app.route('/michmesh-webhook', methods=['POST'])
def webhook():
    body = request.get_data()

    if SECRET:
        if not signature_ok(body):
            app.logger.warning('Refused a request with a missing or wrong signature')
            return 'Bad signature', 403
    else:
        app.logger.warning('WEBHOOK_SECRET is not set; accepted an unsigned request')

    event = request.headers.get('X-GitHub-Event', '')
    if event == 'ping':
        return 'pong', 200
    if event != 'push':
        return f'Ignored {event or "unknown"} event', 202

    ref = pushed_ref(body)
    if ref != DEPLOY_REF:
        return f'Ignored push to {ref}', 202

    subprocess.Popen(['/bin/bash', DEPLOY_SCRIPT])
    return 'Deploying', 200
