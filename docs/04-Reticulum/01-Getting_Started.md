---
sidebar_label: Getting Started
---
# Connect to the Reticulum Network
## Clients

No radio needed to get started: each of these can join the network over the internet through a public TCP hub. The public hubs are generally linked together, so any of them should put you on the wider network; MichMesh runs one at `RNS.MichMesh.net`, port `7822`. Once you're on, say hi in the [group chat](./05-Services.md#join-group-chat).

### Web Client (Fastest Way to Try It) {#web-client}

The [Reticulum web client](https://github.com/thatSFguy/reticulum-webclient) runs in your browser, so there's nothing to install except a small bridge program. Browsers can't open TCP connections themselves; the bridge passes traffic between the page and a Reticulum hub.

1. On a computer, open the [web client](https://thatsfguy.github.io/reticulum-webclient/) in any browser. On a phone, use the [mobile app](#mobile-app) instead.
2. Click **Connect via TCP → Download the bridge**. It's available for Windows, Linux, and macOS on Apple Silicon.
3. Run the bridge and leave it running. On Linux and macOS, `chmod +x` it first. Windows may warn that the file is unrecognized, since it isn't code-signed.
4. Back in the browser, click **Connect (WebSocket)**. The hub field comes filled in with a public hub, so you can connect as-is. If it won't connect, or you'd rather use MichMesh's, enter `RNS.MichMesh.net` port `7822`.
5. Set your **display name** and click **Send Announce** so others can reach you. Other nodes show up in your contacts as their announces arrive.
6. Click **Export Identity** to back up your keys. Your identity lives in this browser, so clearing its site data deletes it.

Have an [RNode](./02-RNode.md)? In Chrome, Edge or Brave the web client can also talk to it directly over Bluetooth or USB, with no bridge and no internet. The web client's [TCP bridge guide](https://github.com/thatSFguy/reticulum-webclient/blob/main/docs/TCP-BRIDGE.md) covers running the bridge against your own `rnsd`.

### Reticulum Mobile App (Android/iOS) {#mobile-app}

The [Reticulum Mobile App](https://github.com/thatSFguy/reticulum-mobile-app) is a native messaging client for Android and iOS. It connects over TCP, or to an RNode over Bluetooth or USB, and also browses NomadNet pages.

1. Install it:
   - **Android:** the APK from the [latest release](https://github.com/thatSFguy/reticulum-mobile-app/releases/latest), or through [Obtainium](https://obtainium.imranr.dev/) for automatic updates.
   - **iOS:** through AltStore or SideStore; see the [iOS install steps](https://github.com/thatSFguy/reticulum-mobile-app#install-on-ios-via-altstore--sidestore).
2. Go to **Settings → Connection** and, under **TCP**, tap **Connect TCP**. **Host** and **Port** come filled in with a public hub the app picked, so you can connect as-is. If it won't connect, or you'd rather use MichMesh's, set **Host** to `RNS.MichMesh.net` and **Port** to `7822`.
3. On Android, tap **Disable battery optimization** in the same section. Otherwise the phone may stop the app in the background and you'll miss messages.
4. Set your **Display name** and tap **Send announce**.

People and services appear in the **Nodes** tab as their announces arrive, and conversations live in **Messages**.

### MeshChat (Windows/macOS/Linux) {#meshchat}
[MeshChat](https://github.com/liamcottle/reticulum-meshchat) is a desktop app with a web-style interface for messaging and browsing NomadNet. Install it from the [releases page](https://github.com/liamcottle/reticulum-meshchat/releases), then connect it to a hub:

1. Click **Interfaces** on the left, then **Add Interface**.
2. Fill in:
   - **Name:** MichMesh
   - **Type:** TCP Client Interface
   - **Target Host:** `RNS.MichMesh.net`, or any other public hub
   - **Target Port:** `7822`
3. Click **Add Interface**, then restart the app.

Once it restarts, announces show up under **Messages** and **Nomad Network**. Click one to send a message or browse a node.

Optional: under **Settings**, **Enable Transport Mode** lets other Reticulum devices on your home network reach the mesh through this computer.

### Sideband (Android/Linux/macOS/Windows) {#sideband}
[Sideband](https://github.com/markqvist/Sideband) is an LXMF messaging app with maps and telemetry sharing. Skip this if you're on the same home network as a Reticulum node that has transport enabled; Sideband finds it on its own.

**On Android:**
1. Open the menu and tap **Connectivity**.
2. Turn on **Connect via TCP**.
3. Set **TCP Host** to `RNS.MichMesh.net` (or any other public hub) and **TCP Port** to `7822`.
4. Close the screen and restart Sideband.

**On a computer:** Sideband uses a Reticulum config file instead. Its **Connectivity** screen shows where the file is. Add the `[[MichMesh TCP]]` interface from the [sample config](#sample-config) below to it, then restart Sideband.

Announces from other nodes should start appearing in the announce stream.

### NomadNet (Terminal) {#nomadnet}
[NomadNet](https://github.com/markqvist/NomadNet) is a text-based client for messaging, browsing and hosting pages, and it has an RRC client for [Relay Chat](./04-Services.md#relay-chat-rrc). Install it into the same Python environment as Reticulum (see [Install Reticulum](#install) below):

```bash
pip install nomadnet
nomadnet
```

NomadNet connects through your Reticulum config: if `rnsd` is running, it uses that; otherwise it reads `~/.reticulum/config`. Either way, add the [sample config](#sample-config)'s TCP interface to reach the mesh.

## Host Your Own Node {#host-your-own-node}
Running `rnsd` on an always-on machine, like a Raspberry Pi or home server, gives every Reticulum app on that machine one shared connection. With transport enabled, it also connects the other devices on your home network.

### Install Reticulum {#install}
1. Create a Python virtual environment for Reticulum, and activate it. On Debian and Raspberry Pi OS you may need `sudo apt install python3-venv` first.
   ```bash
   python3 -m venv ~/reticulum
   . ~/reticulum/bin/activate
   ```
2. Install Reticulum (`rns`) and LXMF (`lxmf`, which provides the `lxmd` daemon):
   ```bash
   pip install --upgrade rns lxmf
   ```
3. Run `rnsd` once to generate the default config files, then stop it with Ctrl-C.

### Start on Boot {#systemd}
Create `/etc/systemd/system/rnsd.service` with `sudo` and your favorite text editor. Use this as a template, replacing `YOURUSERNAME` with the user you installed Reticulum as:
```ini
[Unit]
Description=Reticulum Network Service Daemon
After=multi-user.target

[Service]
Type=simple
Restart=always
RestartSec=3
User=YOURUSERNAME
ExecStart=/home/YOURUSERNAME/reticulum/bin/rnsd

[Install]
WantedBy=multi-user.target
```
Run `sudo systemctl start rnsd`. If that works, `sudo systemctl enable rnsd` starts it on every boot.

### Sample Interface Configuration {#sample-config}
Reticulum needs something to connect to. This config, in `~/.reticulum/config`, connects your node to two things:

- **Default Interface** finds other Reticulum devices on your local network automatically.
- **MichMesh TCP** connects to MichMesh's hub, and through it the wider mesh.

With `enable_transport` on, your node also relays between them, so devices on your home network can reach the mesh through it.

```ini
[reticulum]
  enable_transport = True
  share_instance = Yes
  shared_instance_port = 37428
  instance_control_port = 37429
  panic_on_interface_error = No

[logging]
  loglevel = 4

[interfaces]
  [[Default Interface]]
    type = AutoInterface
    enabled = Yes

  [[MichMesh TCP]]
    type = TCPClientInterface
    enabled = Yes
    target_host = rns.michmesh.net
    target_port = 7822
```

Any public hub works in place of MichMesh's. Restart `rnsd` after any change to the config: `sudo systemctl restart rnsd`. To add radios, see [RNode](./02-RNode.md) and [Other Interfaces](./03-OtherInterfaces.md).

## Vocabulary {#vocabulary}

| Term | Meaning |
| --- | --- |
| **Node** | A participant in the Reticulum network |
| **RNS** | Short for Reticulum Network Stack |
| **LXMF** | The messaging protocol built on Reticulum that most chat apps use |
| **Announce** | A broadcast that tells the network how to reach you |
| **Transport Mode** | Lets a node route and forward other nodes' traffic |
| **Propagation Node** | A node that holds encrypted messages for people who are offline, and delivers them when they reconnect |
