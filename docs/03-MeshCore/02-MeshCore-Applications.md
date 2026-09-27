---
sidebar_label: Applications
---
# Applications To Make Your MeshCore More
- *Note: descriptions of these projects were taken from the respective project websites*
## MeshMapper
[MeshMapper](https://meshmapper.net) MeshMapper visualizes real-world MeshCore coverage using data collected by local mesh operators. Gathered data from Observers both static and via "wardriving", the project is great for visualizing node coverage if your area has been onboarded.

As of August 2026, the following 'zones' have been onboarded and have activity:
- [Detroit / DET](https://det.meshmapper.net) - Covers the greater Detroit metro area.
- [Flint / FNT](https://fnt.meshmapper.net) - Covers Genesee County and parts of Lapeer.
- [Gladwin / GDW](https://gdw.meshmapper.net) - Covers Midland, parts of Mount Pleasant and Houghton Lake, plus Traverse City and, for now, the Upper Peninsula.
- [Kalamazoo / AZO](https://azo.meshmapper.net) - Covers the Kalamazoo area in southwest Michigan.
- [Kent County / Grand Rapids](https://grr.meshmapper.net) - Covers the Grand Rapids Metro area including a few parts of Ottawa county.
- [Midland/Bay City/Saginaw / MBS](https://mbs.meshmapper.net/index.php?lat=43.675&lon=-83.526&zoom=10.35) - Covers parts of Mid Michigan and the Thumb.

## MeshCore Analyzer
[MeshCore Analyzer](https://analyzer.letsmesh.net/map?lat=43.35599&long=-84.7746&zoom=7) is a real-time packet and reliability analysis tool for the MeshCore network aimed at helping repeater owners (MeshCore network operators) improve the reliability, monitor for abuse or bugs, ensure uptime, and optimize the mesh network for everyone's benefit. Packet data is collected by observers (MQTT-connected nodes) and ingested into the service for realtime analysis, enabling the website to "hear" and visualize the network from many perspectives.

## MapMe
[MapMe](https://mapme.sh) is another Mesh-mapping software that visualizes where your MeshCore network actually works. Connect your device via Bluetooth, enable mapping, and as you move around it automatically logs which hexes have coverage based on packets you receive.

## MeshCore Client Apps
You can find all of the links to the official apps on the [MeshCore](https://meshcore.io) website.

### MeshCore Hardened
[MeshCore Hardened](https://github.com/thatSFguy/meshcore-mobile-app) is an independent, open-source MeshCore client for Android. It needs no Google Play Services and nothing phones home: no analytics, accounts, or servers. Messages are encrypted on the phone as well as on the air. It connects over Bluetooth, USB-C, or TCP and covers direct messages, channels, a node map, repeater administration, and firmware updates for nRF52 boards over Bluetooth. It can also show the route a message actually took across the mesh, hop by hop.

It can join a mesh by scanning a settings QR code. See [Quick Setup by QR](./01-Getting-Started.md#quick-setup-by-qr-android) for Michigan's. Install it through [Obtainium](https://obtainium.imranr.dev/) for automatic updates, or grab the APK from the [latest release](https://github.com/thatSFguy/meshcore-mobile-app/releases/latest). Needs Android 8.0 or later; AGPL-3.0.

### MeshCore One
[MeshCore One](https://meshcoreone.com) is a third-party client for iPhone, iPad, and Apple Silicon Macs. It is not the official app, and it is open source under the GPLv3. Alongside the usual messages, channels, and QR contact sharing, it leans into diagnostics: trace path, line of sight analysis, RX logging, and remote management of repeaters and room servers. Free on the [App Store](https://apps.apple.com/us/app/meshcore-one/id6757419477), needs iOS 18 or later; source and sideload builds are on [GitHub](https://github.com/Avi0n/MeshCoreOne).
