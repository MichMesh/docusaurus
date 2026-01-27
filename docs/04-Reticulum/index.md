---
sidebar_label: Reticulum
---
# Intro To Reticulum
### What is it?
Reticulum Network Stack (RNS) is just as it says on the tin, a network stack with a chat protocol (as well as other protocols). The other players in the open source LoRa scene are mainly chat or telemetry tools.

You can currently:
- create and serve a micron page (something between a BBS page and a webpage)
- send images or files (attachment sizes >1mb may require some configuration)
- send shell commands remotely
- make voice calls (even over low bandwidth LoRa Connections).
- send messages to any other node connected on your network (even offline nodes if a propagation node is on your network)

### Why create another mesh? 
Reticulum was created 15+ years ago with a broader scope than Meshtastic or Meshcore. It was designed with both very large and small scale meshing and automatic discovery in mind.  You can create a local area network (BT/wifi/wired), medium area (RF, LoRa), and large area (TCP) networks in mind

### What is the reticulum topology like?
It can be however you want it. It supports a variety of physical transport mediums such as RF, LoRa, Wifi, Bluetooth, Serial, and both tcp and udp networking.  IPv6 can be used to automatically discover local network nodes without any configuration.  IP based networking is not required by Reticulum.

Reticulum clients periodically send out announcements which will be forwarded along all available paths.

The easiest way to implement an RF only reticulum network between homes and regionally is to setup a network connected raspi with an rnode up high to connect to the city-wide mesh. That single transport node will share the mesh over your home network without having to carry around mesh nodes everywhere you go.

### HF connections
We have tested an HF connection between Chicago and mid-Michigan. It's not always up, but can be if we get at least another person onboard. This connection is much slower, somewhere around 1200 baud. This is enough for messaging, but not the greatest for browsing nomadnet. We are currently testing on the (unpoliced) 6.78mhz HF ISM band which does not require a licence, but is supposed to be run with lower power.

### Handy Links & Tools
1. Micron Syntax Examples and Live Editor - https://rfnexus.github.io/micron-parser-js/
2. Markdown to Micron Conversion - https://github.com/randogoth/md2mu
