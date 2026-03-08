---
sidebar_label: Interfaces 
---
# Interfaces
Reticulum is great in the fact that it is agnostic of what interface type it is using. You can run over LoRa, WiFi, Ethernet, HaLow, SSB on the VLF/HF ISM bands, 1200/4800/9600 baud packet radio, serial interfaces, or just about any other method where you can pass more than about 100 *BITS* per second! Here are a few to give you some inspiration.
## HF FreeDV-TNC2 6.822mhz - freq in flux
Connect your radio to your computer using whatever radio interface you choose.
Follow the install instructions for the [FreeDVinterface](https://github.com/RFnexus/FreeDVInterface)
## Btech UV-Pro and similar radios
Thanks to [HamRadioTech](https://www.hamradiotech.de/posts/2025-09-11-VR-N76-KISS-TNC/) for figuring this out for us. This method assumes using linux. If someone wants to test it out on other platforms and get me a write up, I'll gladly post it. 
1. On the radion enable `KISS TNC` under `menu` -> `General Settings` -> `KISS TNC` -> `Enable KISS TNC`
2. Make sure the app on your phone is not connected to the radio. I removed it from my BT pairings just to make sure it didn't try as it will boot your KISS comms.
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
6. If the bluetooth connection is lost, or you are having issues getting the connection to work, you may need to stop rns, turn off the radio, remove the device file, restart the radio, recreate the device, and restart rns. I made this little script to do so - it assumes you setup the rnsd service file similar to above. Save this somewhere and make it executable with `chmod +x filename.sh`:
```
#!/bin/bash
clear
if [[ -f /dev/rfcomm0 ]] ; then
  echo "Stopping rnsd"
  sudo systemctl stop rnsd
  read -p "please turn off the radio and hit enter" stopRadio
  echo removing the rfcomm file
  sudo rfcomm release 0
  read -p "Please turn on your radio and hit enter" startRadio
fi
read -p "Hit enter when your radio is on and bluetooth is connected" startRadio
echo "creating new /dev/rfcomm0"
sudo rfcomm bind /dev/rfcomm0 38:D2:00:01:11:C6 1 ### change the mac address to match your radio
sudo systemctl restart rnsd

```

# Vocabulary
Node - A participant in the reticulum network

Propagation Node - A node which runs a buffer of encrypted 
messages, allowing for later delivery if a node is offline

LXMF - protocol for resilient delivery of data

RNS - shorthand for Reticulum Network Stack

Transport Mode - This setting enables routing and traffic forwarding
