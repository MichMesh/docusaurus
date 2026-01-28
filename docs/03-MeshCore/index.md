---
sidebar_label: Meshcore
---
# Wait, ANOTHER Mesh?
From the MeshCore official page:
>MeshCore is a multi platform system for enabling secure text based communications utilizing LoRa radio hardware. It can be used for Off-Grid Communication, Emergency Response & Disaster Recovery, Outdoor Activities, Tactical Security including law enforcement, private security and also IoT sensor networks.

## Core Differences (see what I did there?)
Instead of re-inventing the wheel, there is a great write up from the folks over at AustinMesh that goes into great detail on the differences between the two Mesh types (Tastic, Core). 
[Meshtastic vs. MeshCore on Austin Mesh](https://www.austinmesh.org/learn/meshcore-vs-meshtastic/)
Essentially, if you want a turn key it just works, mobile on the go with telemetry support, Tastic is the way to go. The flood routing allows for random pop-up on the go networks of just clients perfect for search and rescue or camping/hiking. If you want to set up a reliable less mobile netowork to cover a city/town/region where you are able to set up OR utilize established repeaters, Core is the way to go.

## The US is Lonely, So Lonely
Unlike MeshTastic, MQTT is NOT built in, making MeshCore truly an off-grid solution. This means, either you are building out the network for your area, or joining an established network (which is unlikely unless you are in Europe or the Pacific Northwest). There IS an option to connect a Companion/Sensor/Repeater/Room-Server Node to the MeshCore Packet Analyzer project, but that does NOT extend your network into the internet the way MeshTastic does. It is simply for data purposes to view and track network health and reliability. It's a neat project, and instructions will be provided in another section if you want to participate.

## Node Role Types (Dont be THAT person...)
- Companion - Same as "Client" with MeshTastic. Firmware Bluetooth Only or USB Only option. 99% of the time this is what you will need.
- Repeater - Recommended for stationary nodes with some altitude. They do NOT recommend these for mobile nodes i.e. solar powered vehicle nodes. Can only be managed via USB OR LoRa connection from a companion node.
- Room Server - Used to serve a "Chat Room". Can only be managed via USB OR LoRa connection from a companion node.
- Sensor - Currently in development, and only available through self-compiled firmware.

