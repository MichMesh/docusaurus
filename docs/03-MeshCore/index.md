---
sidebar_label: Meshcore
---
# Wait, ANOTHER Mesh?
From the [MeshCore Official page](https://meshcore.io/):
>MeshCore is a multi platform system for enabling secure text based communications utilizing LoRa radio hardware. It can be used for Off-Grid Communication, Emergency Response & Disaster Recovery, Outdoor Activities, Tactical Security including law enforcement, private security and also IoT sensor networks.

## Core Differences (see what I did there?)
Instead of re-inventing the wheel, there is a great write up from the folks over at AustinMesh that goes into great detail on the differences between the two Mesh types (Tastic, Core). 
[Meshtastic vs. MeshCore on Austin Mesh](https://www.austinmesh.org/learn/meshcore-vs-meshtastic/)
Essentially, if you want a turn-key "it just works", mobile on the go with telemetry support solution, Tastic is the way to go. The flood routing allows for random pop-up on the go networks of just clients perfect for search and rescue or camping/hiking. If you want to set up a reliable less mobile network to cover a city/town/region where you are able to set up OR utilize established repeaters, Core is the way to go.

## The US is Lonely, So Lonely:
Unlike MeshTastic, MQTT is NOT built in, making MeshCore truly an off-grid solution. This means, either you are building out the network for your area, or joining an established network (which is unlikely unless you are in Europe or the Pacific Northwest). There IS an option to connect a Companion/Sensor/Repeater/Room-Server Node to the [MeshCore Analyzer](https://analyzer.letsmesh.net/about) project, but that does NOT extend your network into the internet the way MeshTastic does. It is simply for data purposes to view and track network health and reliability. Checkout the [MeshCore Analyzer](./02-MeshCore-Applications.md#MeshCore-Analyzer) project for what it does and where to find it.

## Node Role Types (Don't be THAT person...)
- Companion - Same as "Client" with MeshTastic. 99% of the time this is what you will need. Bluetooth or USB on the web flasher; WiFi, serial, and Ethernet builds exist for the few boards that support them.
- Repeater - Recommended for stationary nodes with some altitude. They do NOT recommend these for mobile nodes i.e. solar powered vehicle nodes. No Bluetooth in repeater firmware, so manage it over USB or over LoRa from a companion node. See the [Repeater Setup guide](./03-Repeater-Setup.md) to get one on the air.
- Room Server - Used to serve a "Chat Room". Managed the same way a repeater is, over USB or LoRa from a companion node.
- Sensor - A node that reports readings instead of chatting. It stays quiet until a companion asks it for telemetry, so it sips battery. The firmware auto-detects common I2C parts over a wide range of environmental and power sensors, and some boards (T1000-E, SenseCAP Solar Node) have sensors built in. The catch: the web flasher only offers Companion, Repeater, and Room Server, so sensor builds have to be compiled and flashed yourself. See the [sensor commands](https://docs.meshcore.io/cli_commands/#sensors-when-sensor-support-is-compiled-in) in the MeshCore docs.

