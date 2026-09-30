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

## MeshCore Is Expanding in the US

Unlike Meshtastic, MeshCore does not rely on MQTT to extend the mesh over the internet. This allows a MeshCore network to operate as a truly off-grid, RF-based communications network. In practice, this means you are either helping build out MeshCore infrastructure in your area or connecting to an existing network. Michigan has seen rapid growth in MeshCore deployments, with new repeaters and coverage areas continuing to come online. MeshCore nodes can also be configured as observers, allowing them to report network data to one or more MQTT servers. This does not extend the RF mesh through the internet or create internet-based hops between otherwise disconnected networks. Instead, observer data is used for monitoring, mapping, and analyzing network activity, coverage, and reliability. A good example is the [West Michigan Mesh Map](https://www.westmichmesh.org/map), which uses CoreScope & observer data to visualize MeshCore activity and network health across the region.

## Node Role Types (Don't be THAT person...)
- Companion - Same as "Client" with MeshTastic. 99% of the time this is what you will need. Bluetooth or USB on the web flasher; WiFi, serial, and Ethernet builds exist for the few boards that support them.
- Repeater - Recommended for stationary nodes with some altitude. They do NOT recommend these for mobile nodes i.e. solar powered vehicle nodes. No Bluetooth in repeater firmware, so manage it over USB or over LoRa from a companion node. See the [Repeater Setup guide](./03-Repeater-Setup.md) to get one on the air.
- Room Server - Used to serve a "Chat Room". Managed the same way a repeater is, over USB or LoRa from a companion node.
- Sensor - A node that reports readings instead of chatting. It stays quiet until a companion asks it for telemetry, so it sips battery. The firmware auto-detects common I2C parts over a wide range of environmental and power sensors, and some boards (T1000-E, SenseCAP Solar Node) have sensors built in. The catch: the web flasher only offers Companion, Repeater, and Room Server, so sensor builds have to be compiled and flashed yourself. See the [sensor commands](https://docs.meshcore.io/cli_commands/#sensors-when-sensor-support-is-compiled-in) in the MeshCore docs.

