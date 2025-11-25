## Wait, ANOTHER Mesh?
From the MeshCore official page:
>MeshCore is a multi platform system for enabling secure text based communications utilising LoRa radio hardware. It can be used for Off-Grid Communication, Emergency Response & Disaster Recovery, Outdoor Activities, Tactical Security including law enforcement, private security and also IoT sensor networks.

## Core Differences (see what I did there?)
Instead of re-inventing the wheel, there is a great write up from the folks over at AustinMesh that goes into great detail on the differences between the two Mesh types (Tastic, Core). 
[Meshtastic vs. MeshCore on Austin Mesh](https://www.austinmesh.org/learn/meshcore-vs-meshtastic/)
Essentially, if you want a turn key it just works, mobile on the go with telemetry support, Tastic is the way to go. The flood routing allows for random pop-up on the go networks of just clients perfect for search and rescue or camping/hiking. If you want to set up a reliable less mobile netowork to cover a city/town/region where you are able to set up OR utilize established repeaters, Core is the way to go.

## The US is Lonely, So Lonely
Unlike MeshTastic, MQTT is NOT built in, making MeshCore truly an off-grid sollution. This means, either you are building out the network for your area, or joining an establish network (which is unlikely unless you are in Europe or the Pacific Northwest). There IS an option to connect a Companion/Sensor/Reapter/Room-Server Node to the MeshCore Packet Analyzer project, but that does NOT extend your network into the internet the way MeshTastic does. It is simply for data purposes to view and track network health and reliability. It's a neat project, and instructions will be provided in another section if you want to participate.

## Node Role Types (Dont be THAT person...)
- Companion - Same as "Client" with MeshTastic. Firmare Bluetooth Only or USB Only option. 99% of the time this is what you will need.
- Repeater - Recommended for stationary nodes with some altitude. They do NOT reccomend these for mobile nodes i.e. solar powered vehicle nodes. Can only be managed via USB OR LoRa connection from a companion node.
- Room Server - Used to serve a "Chat Room". Can only be managed via USB OR LoRa connection from a companion node.
- Sensor - Currently in development, and only available through self-compiled firmware.

## Flashing Your Device
Using the [MeshCore Web Flasher](https://flasher.meshcore.co.uk/) is similar to the MeshTastic one if you are already familiar with the process with one exception.

- Connect your device to your computer via USB
- Select your device from the list (MichMesh Node is ProMicro nrf52 (faketec))
- Select your node's role type (See list above for explanation)
- Click the Enter DFU Mode, select your device from the pop-up
- IMPORTANT - Click Erase Flash, select your device from the pop-up. This MUST be done if this is a first time MeshCore flash for the device!
- Click Flash, select your device from the pop-up.

## Setting Up Your Device (Companion)
If your device has a screen, like the T114, you will get the bluetooth pin. I suggest paying attention and writing it down because the screen time out on some of these units is quick. If you missed it, simply reset it and it will pop up and give you a new pin. OTHERWISE, the default is 123456.

- Connect via Bluetooth. IF This is a device you previously paired, you'll first want to "forget" the device in your phone's/computer's bluetooth settings.
- Go to Settings (Cog Icon in Android App)
- Set your Name. Unlike MeshTastic, there is only a "Long Name".
- Set your Lat/Long if your node is stationary. Select "Share Position in Advert" if you would like.
- In Radio Settings, select "Choose Preset". Select USA/Canada (Recommended) if in the US.
- Tap the "Check Mark" in the upper right (if on Android). This applies the current settings.
- Bluetooth Settings - Change it to "Custom" and put in a 6 digit pin. If you forget it, you will have to do a delete flash then re-flash. Tap Check mark in upper right (if on Android) then scroll down and reboot. You will need to reconnect to the device (select forget from phone/computers menu first).

From here, it depends on personal preference and if you have any sensors attached. WARNING: This is still new, and there are bugs. Things like environmental and GPS sensors are hit or miss. One may work while the other wont, or niether will. Its a mixed bag at the moment, but a work in progress none the less. IF you get GPS to work, remember anytime the device is rebooted/restarted you will HAVE to reenable GPS Mode in Position settings. The current firmware auto disables on every boot. This is also a setting you must enable in the mentioned submenu, tap that sub-menu's "Check Mark" in the upper right, then leave the submenu and select the "Check Mark" in the upper right in the main settings menu.
