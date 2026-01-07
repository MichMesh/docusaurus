---
sidebar_label: Getting Started
---
# Connect to the Reticulum Network
## Clients
### Meshchat (Cross Platform/Portable)
If you prefer a web based interface, use meshchat. You can install from the [releases](https://github.com/liamcottle/reticulum-meshchat/releases) section of the [meshchat repo](https://github.com/liamcottle/reticulum-meshchat) or build using the instructions from the main [README.md](https://github.com/liamcottle/reticulum-meshchat/blob/master/README.md)
To join the Michmesh testnet:
- click Interfaces on the left.
- click add interface
- Name: Michmesh Testnet
- Type: TCP Client Interface
- Target Host: RNS.MichMesh.net
- Target Port: 7822
- click Add Interface
- Optional: enable transport mode - this will make it so other instances on your home network will have access to the testnet.
- - click Settings on the left
- - check Enable Transport Mode
- Restart the app.
After it restarts, you should see announces under Messages or Nomad Network. You can click them and send messages or browse the nomadnet

### Sideband (Linux/Android/MacOS/Windows)
Sideband is a LXMF client. 
For mobile connectivity or if you already have a transport node configured above on the network, you dont need to do the following. 
To setup TCP connection to the test net:
- click the hamburger menu,
- click `Connectivity` 
- enable `Connect via TCP`
- TCP Host: RNS.MichMesh.net
- TCP Port: 7822
- x out of the config 
- restart Sideband.

You should now be seeing things show up in the announce stream.
### nomadnet (*nix text based interface)
If you want to install the console based nomadnet:
`pip install nomadnet`

# Host your own Node!
## Initial Setup
### You will probably want to create a python venv specifically for reticulum stuff.
`cd ~/ ; python -m venv reticulum`
### load the new python venv
`. ~/reticulum/bin/activate`
### install rns, lxmfd 
```
pip install --upgrade rns lxmf
```
Start rnsd to generate the config files, then ctrl-c out:
```
rnsd
^c
``` 
### If you want the services to start on boot, setup a systemd.service file
Use your favorite text editor to create `/etc/systemd/system/rnsd.service`, you will need to use sudo. 
Use the following as a template, change the username to match the user we installed reticulum with above.
```
[Unit]
Description=Reticulum Network Service Daemon
After=multi-user.target

[Service]
Type=simple
Restart=always
RestartSec=3
User=YOURUSERNAME
ExecStart=/home/YOURUSERNAME/reticulum/bin/python3 /home/YOURUSERNAME/reticulum/bin/rnsd

[Install]
WantedBy=multi-user.target
```
Now run `sudo systemctl start rnsd`. If that worked, you can now run `sudo systemctl enable rnsd` to start it on boot.
### Sample interface configuration

#### edit ~/.reticulum/config 
Use the following to configure your machine as a bridge to all on the same subnet with the MichMesh test net. This test net is also connected to the Chicago test net, which is connected to a European test net. The connection to the euro net will likely be dropped once we get a critical mass of services running.
```
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
    name = Default Interface
    selected_interface_mode = 1
    configured_bitrate = None
  [[michmesh TCP]]
    type = TCPClientInterface
    interface_enabled = true
    target_host = rns.michmesh.net
    target_port = 7822
    name = michmesh TCP
    selected_interface_mode = 1
    configured_bitrate = None
```
Restart RNSd after any changes to the config file using `sudo systemctl restart rnsd`
# Radio interfaces
### LoRa
Take a look at the [RNode setup](RNode)

### HF FreeDV-TNC2 6.822mhz - freq in flux
Connect your radio to your computer using whatever radio interface you choose.
Follow the install instructions for the [FreeDVinterface](https://github.com/RFnexus/FreeDVInterface)

# Vocabulary
Node - A participant in the reticulum network

Propagation Node - A node which runs a buffer of encrypted 
messages, allowing for later delivery if a node is offline

LXMF - protocol for resilient delivery of data

RNS - shorthand for Reticulum Network Stack

Transport Mode - This setting enables routing and traffic forwarding
