---
sidebar_label: Getting Started
---
# Connect to the Reticulum Network
## Clients
### Meshchat (Cross Platform/Portable)
If you prefer a web based interface, use meshchat. You can install from the [releases](https://github.com/liamcottle/reticulum-meshchat/releases) section of the [meshchat repo](https://github.com/liamcottle/reticulum-meshchat) or build using the instructions from the main [README.md](https://github.com/liamcottle/reticulum-meshchat/blob/master/README.md).  
To join the Michmesh testnet:
- click Interfaces on the left.
- click add interface
- Name: Michmesh Testnet
- Type: TCP Client Interface
- Target Host: RNS.MichMesh.net
- Target Port: 7822
- click Add Interface
- Optional: enable transport mode - this will make it so other devices on your home network will have access to the testnet.
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
## Sample interface configuration
To make use of the RNS stack, you need something to connect to. The `Default Interface` will connect to anyone else on your network. `Michmesh TCP` will connect to the Michigan test network. You can also connect to many RF networks, here we will outline a few.
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
  [[Michmesh TCP]]
    type = TCPClientInterface
    interface_enabled = true
    target_host = rns.michmesh.net
    target_port = 7822
    name = michmesh TCP
    selected_interface_mode = 1
    configured_bitrate = None
```
Restart RNSd after any changes to the config file using `sudo systemctl restart rnsd`
### Radio interfaces
#### LoRa
Take a look at the [RNode setup](RNode)

#### HF FreeDV-TNC2 6.822mhz - freq in flux
Connect your radio to your computer using whatever radio interface you choose.
Follow the install instructions for the [FreeDVinterface](https://github.com/RFnexus/FreeDVInterface)
#### Btech UV-Pro and similar radios
Thanks to [HamRadioTech](https://www.hamradiotech.de/posts/2025-09-11-VR-N76-KISS-TNC/) for figuring this out for us. This method assumes using linux. If someone wants to test it out on other platforms and get me a write up, I'll gladly post it. 
1. On the radion enable `KISS TNC` under `menu` -> `General Settings` -> `KISS TNC` -> `Enable KISS TNC`
2. Make sure the app on your phone is not connected to the radio. I removed it from my BT pairings just to make sure it didnt try as it will boot your KISS comms.
3. Setup the radio's bluetooth connection.
- In a terminal, run `bluetoothctl`. 
- Once in the bluetoothctl shell, run `scan on`
- Enable pairing on the radio by going to `menu` -> `Pairing`
- You should see your radio listed in the `bluetoothctl` shell. Once you do, run `scan off`
- Copy the bluetooth mac address
- run `pair 38:D2:00:AA:BB:CC`, pasting your mac address instead of `38:D2:00:AA:BB:CC`
- run `trust 38:D2:00:AA:BB:CC`, again pasting your mac address instead of `38:D2:00:AA:BB:CC`
- run `sudo rfcomm bind /dev/rfcomm0 38:D2:00:AA:BB:CC 1` to create the /dev/rfcomm0 device. If you need to delete it and recreate, the delete command is `sudo rfcomm release 0`
- ctrl-d will exit out of the `bluetoothctl` shell. ctrl-d again will exit out of your terminal.
- Restart your radio. Delete the device with `sudo rfcomm release 0`, once your radio is back up, re-create the device. (This part might be cargo-culting, but it's what I had to do to get it to work the first time)
4. edit your ~/.reticulum/config file and add the following to the `[interfaces]` section:
```
  [[uv-pro]]
    type = KISSInterface 
    interface_enabled = true
    port = /dev/rfcomm0
    speed = 1200
    databits = 8
    parity = none
    stopbits = 1
    flow_control = false
    preamble = 150 
    txtail = 10
    persistence = 200
    slottime = 20
```
5. Save and restart rnsd - If you are using the `systemd` config above, you can do this with `sudo systemctl restart rnsd`. You will need to restart `rnsd` whenever any changes are made to the rns config.
6. If the bluetooth connection is lost, or you are having issues getting the connection to work, you may need to stop rns, turn off the radio, remove the device file, restart the radio, recreate the device, and restart rns. I made this little script to do so - it assumes you setup the rnsd service file simlar to above. Save this somewhere and make it executable with `chmod +x filename.sh`:
```
#!/bin/bash
clear
echo "Stopping rnsd"
sudo systemctl stop rnsd
read -p "please turn off the radio and hit enter" stopRadio
if [[ -f /dev/rfcomm0 ]] ; then
  echo removing the rfcomm file
  sudo sudo rfcomm release 0
fi
read -p "Please turn on your radio and hit enter" startRadio
echo "creating new /dev/rfcomm0
sudo rfcomm bind /dev/rfcomm0 38:D2:00:AA:BB:CC 1 ### change the mac address to match your radio
sudo systemctl restart rnsd

```

# Vocabulary
Node - A participant in the reticulum network

Propagation Node - A node which runs a buffer of encrypted 
messages, allowing for later delivery if a node is offline

LXMF - protocol for resilient delivery of data

RNS - shorthand for Reticulum Network Stack

Transport Mode - This setting enables routing and traffic forwarding
