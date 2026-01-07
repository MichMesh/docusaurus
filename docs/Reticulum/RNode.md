---
sidebar_label: RNode
---
# How to setup an RNode from the CLI
This assumes that you have already have a running RNS instance in a python venv running under `~/reticulum/`.
1. Connect a supported ESP32 node, in my example I will be using a Heltec V4. Make sure to use a data cable and not a charging cable.
2. Load your python venv. `. ~/reticulum/bin/activate`
3. Run `rnodeconf --autoinstall`
- It will ask if your node is connceted. Hit enter when it is.
- It will now ask which device you want to install to, I am installing to #1:
```
Hello!

This guide will help you install the RNode firmware on supported
and homebrew devices. Please connect the device you wish to set
up now. Hit enter when it is connected.

Detected serial ports:
  [1] /dev/ttyACM0 (USB JTAG/serial debug unit, 90:70:69:85:4D:64)

Enter the number of the serial port your device is connected to:
? 1
```
- It will then probe the device to figure out what it is. I am selecting `9` for Heltec V4.
- It might tell you that Heltec is experimental. If so, hit enter.
- It will now ask what frequency this device is designed for. Since I am in the USA, I am choosing `2`, 915mHz.
- It will now ask you to verify the info from prev steps before writing the firmware. If it's right, input y, then enter.
- It will now download and write the latest firmware and do all prep work needed to use it.
- The scripted shutdown may error out, if so, hit the reset button and check the screen.
3. WiFi (optional)
- We can now tell it to connect to our WiFi. `rnodeconf /dev/ttyACM0 -w --wifi-mode sta --ssid MyWiFi --psk ontheceiling`
- If you want to have the device act as an access point (a mobile node in your car/truck for example) you can use  `rnodeconf /dev/ttyACM0 -w --wifi-mode ap --ssid MyMobileWiFi --psk ItReallyIsMadeOfStarStuff`
4. Now to configure the rnode interface in your `~/.reticulum/config`
- Add the following to the `[interfaces]` section of your `~/.reticulum/config`, changing the port to match either the IP address or name of your rnode. The ip should be displayed on your rnode if it has a screen.
```
  [[rnode]]
    type = RNodeInterface
    interface_enabled = true 
    port = tcp://rnodeD45D.local # for a wifi node, or the path to your usb or bluetooth device e.g. /dev/ttyACM0 or ble://rnoded45d
    frequency = 914875000
    bandwidth = 125000
    txpower = 22
    spreadingfactor = 8
    codingrate = 5
    name = rnode
    selected_interface_mode = 1
    configured_bitrate = None

```
5. Restart RNSd. If you previously setup a systemd file, you can run `sudo systemctl restart rnsd`

