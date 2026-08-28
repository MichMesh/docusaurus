---
sidebar_label: Repeater Setup
---
# Repeater Setup Guide

So you've decided to run a repeater. Nice. This guide walks you through getting a MeshCore repeater node online, tuned, and verified.

## Before You Start

If you flashed with Repeater firmware from the [MeshCore Web Flasher](https://flasher.meshcore.io/), the repeater role is already baked in. Getting online is mostly about verifying your radio preset and syncing the clock.

**The essentials:**

- **Flash Repeater firmware** via the [web flasher](https://flasher.meshcore.io/) — use a Chromium-based browser, since the flasher needs the Web Serial API.
- **Mount high with line of sight** and use a real external antenna. Elevation and antenna quality matter more than transmit power.
- **Use a stable power supply** — wall adapter, POE, or solar with battery backup. Avoid bus-powered USB hubs.
- **Verify and tune via USB / Web Serial** — walk through the checklist below.
- **Claim a unique public key prefix** so your repeater doesn't collide with one already on the mesh.

:::note nRF52 boards only: Install OTAFIX
Flash [OTAFIX](https://github.com/oltaco/Adafruit_nRF52_Bootloader_OTAFIX) before the repeater firmware as it falls back to DFU mode when an OTA update fails. See the [install instructions here](https://blog.meshcore.io/2026/04/06/otafix-bootloader).
:::

:::caution Clock Sync Required
Repeaters boot with an old date. Without a correct clock, relayed message timestamps will be wrong.

- **GPS-capable firmware + hardware:** `gps on` then `gps sync`
- **Otherwise:** connect via companion app or Web Serial and run `clock sync` after every reboot or power cycle.
:::

:::warning CLI Syntax
The MeshCore CLI uses **spaces**, not `=`. Typing `set path.hash.mode = 1` can silently fail or store garbage. Always use `set path.hash.mode 1`.
:::

## Understanding the Settings

### txdelay / direct.txdelay
Controls how long a repeater waits before retransmitting a received packet. The firmware works out `unit = estimated_airtime × txdelay`, then picks the actual delay uniformly at random between `0` and `5 × unit`. Higher values create a wider random window, meaning more deference to other nodes. `direct.txdelay` is the same but for routed point-to-point messages (usually set lower for faster delivery). Both accept `0`–`2`; repeater firmware ships at `txdelay 0.5` and `direct.txdelay 0.3`.

### rxdelay — SNR-Based Path Selection
Only affects flood packets. Direct (point-to-point) packets are always processed immediately. Delays processing of floods based on signal quality (SNR). Strong signal = processed immediately. Weak signal = delayed and likely dropped as a duplicate. The mesh naturally prefers the strongest, cleanest paths without manual routing. It accepts `0`–`20` and ships **off** (`0`).

### agc.reset.interval — Radio Deafness Prevention
Periodically resets the LoRa radio's Automatic Gain Control (AGC) to prevent "deafness" caused by strong out-of-band RF interference. Without this, the SX1262 AGC can lock up, clamping the noise floor at -120 dBm and making the repeater unable to hear weaker signals until rebooted. Especially important for repeaters near broadcast towers or other RF sources.

### dutycycle — Airtime Throttle
Repeater firmware ships with an airtime budget factor of `1.0`. The dispatcher computes `duty_cycle = 1 / (1 + airtime_factor)`, so that default works out to **50%**: the repeater accrues transmit budget at half of elapsed time and defers sending once it runs dry. The US 915 MHz ISM band has no duty cycle limit, so a repeater left at the default is giving away half its airtime. `set dutycycle 100` drives the factor to `0` and removes the throttle.

### loop.detect: Packet Storm Protection
Before repeating a flood, the repeater counts how many times its own hash already appears in that packet's path and drops the packet once the count hits a threshold. Defaults to `off`. The three levels set how many repeats it tolerates, and the threshold tightens as the hash gets wider:

| Level | 1-byte | 2-byte | 3-byte |
| --- | --- | --- | --- |
| `minimal` | 4 | 2 | 1 |
| `moderate` | 2 | 1 | 1 |
| `strict` | 1 | 1 | 1 |

### advert.interval: Local Advert Timer
How often the repeater sends a zero-hop advert, heard only by nodes in direct range. Accepts 60–240 minutes and defaults to `0`, which is off.

### flood.advert.interval: Network-Wide Advert Timer
How often the repeater floods an advert across the whole mesh, so nodes out of direct range can still find it. Accepts 3–168 hours and defaults to `47`.

### flood.max — Flood Hop Limit
Drops a flood packet once its recorded path has reached this many hops. Repeater firmware defaults to `64`.

Worth knowing before you tune it: a packet's path field holds 64 bytes total, so at `path.hash.mode 1` (2-byte hashes) a flood can only ever carry **32 hops** before it runs out of room. Setting `32` costs nothing and matches what other networks publish, but genuinely bounding flood propagation would need a value well below it.

### path.hash.mode: Path ID Size

:::note Michigan Standard
Michigan settled on `path.hash.mode 1` as of May 20, 2026. Make sure to set this on any repeater, and on your companion too. It sets the ID size on the packets your node floods, including the advert the rest of the mesh uses to learn a path back to you. It has no effect on what your node receives.
:::

Every node has a short ID taken from its public key. As a packet floods across the mesh, each repeater that relays it stamps its own ID into the packet, building up a record of the route it took. That record is what lets the mesh learn a path back. `path.hash.mode` sets how many bytes long your ID is in that record.

| Mode | ID size | Possible IDs |
| --- | --- | --- |
| `0` | 1 byte | 256 |
| `1` | 2 bytes | 65,536 |
| `2` | 3 bytes | 16,777,216 |

Repeater firmware still ships on mode `0`. With only 256 IDs to go around, two repeaters in the same area will sooner or later end up with the same one, and the mesh can no longer tell which of them a path actually goes through. Mode `1` makes that vanishingly unlikely. The [MeshCore CLI reference](https://docs.meshcore.io/cli_commands/#view-or-change-this-nodes-advert-path-hash-size) has the full details.

### Public Key Prefix
A repeater stamps itself into a packet's routing path using the leading bytes of its public key — its **prefix** — and matches inbound direct packets against that same prefix. `path.hash.mode` sets the width: mode `1` means 2 bytes, so four hex characters out of 65,536 possibilities.

Don't confuse that with the 1-byte prefix apps display. Destination addressing is a fixed 1 byte regardless of `path.hash.mode`, and with only 256 values duplicates are routine; the firmware handles them by attempting decryption, so they're cosmetic. The 2-byte path prefix is the one that must be unique — two repeaters sharing it both claim the same path entry and both retransmit. The prefix is part of the keypair, so claiming a different one means generating a new key.

## First-Run CLI Checklist

The minimum steps after flashing Repeater firmware. Use the Web Serial console at [config.meshcore.io](https://config.meshcore.io).

### 1. Confirm Firmware and Role

Repeater firmware sets the role automatically. You should see `role = Repeater`.

```bash path=null start=null
ver
board
get role
```

### 2. Verify Radio Settings

Read back the radio configuration and confirm it matches your network's preset. If you selected **USA/Canada (Recommended)** in the [web flasher](https://flasher.meshcore.io/), you should be good — that preset applies:

| Setting | Value |
| --- | --- |
| Frequency (MHz) | 910.525 |
| Bandwidth (kHz) | 62.5 |
| Spreading factor | 7 |
| Coding rate | 5 |

```bash path=null start=null
get radio
get tx
```

### 3. Apply Settings (Only If Read-Back Didn't Match)

If step 2 showed incorrect values, set them manually. Adjust these to match your network's agreed-upon preset.

```bash path=null start=null
set radio <freq>,<bandwidth>,<spreading_factor>,<coding_rate>
set tx <power>
```

### 4. Set Name and Location

Set the name the rest of the mesh will see, and the repeater's coordinates. Location isn't required, but it's what lets everyone see where coverage already exists and where the gaps are. Coordinates are decimal degrees, not degrees/minutes/seconds.

```bash path=null start=null
set name <YourRepeaterName>
set lat <42.7336>
set lon <-84.5555>
```

### 5. Set Owner Info

Free-text contact details so somebody can reach you about the node. An email address, a Discord handle, an amateur radio callsign, or whatever else will actually reach you. Optional, but a repeater nobody can contact is a repeater nobody can tell you is misbehaving. `|` characters become line breaks.

```bash path=null start=null
set owner.info <your_contact_details>
```

### 6. Set an Admin Password

Repeater firmware ships with the admin password set to the literal string `password`. Until you change it, anyone in radio range can log in over the mesh and reconfigure your node. Change it before the repeater goes up.

```bash path=null start=null
password <your_admin_password>
```

### 7. Enable 2-Byte Path Hashes

Michigan runs `path.hash.mode 1`. See [path.hash.mode](#pathhashmode-Path-ID-Size) above for what it does and why it matters.

```bash path=null start=null
set path.hash.mode 1
get path.hash.mode
```

### 8. Sync the Clock

```bash path=null start=null
# GPS-capable firmware + hardware:
gps on
gps sync

# Otherwise — companion app or Web Serial, after every reboot:
clock sync
```

### 9. Reboot and Verify

Reboot, reconnect serial, then confirm settings persisted and time is correct.

```bash path=null start=null
reboot
clock
get role
```

## Claim a Unique Public Key Prefix

Repeaters identify each other by the leading bytes of their public key. The firmware generates that key at random on first boot, and nothing stops it from landing on a prefix a nearby repeater already uses.

:::warning Prior to going online
The public key *is* the repeater's identity. Rekeying means everyone who already has this repeater as a contact has to re-add it, and admin sessions tied to the old identity stop working. Check your prefix now — rekeying a repeater that's already carrying traffic disrupts everyone using it.
:::

### 1. Read Your Current Prefix

```bash path=null start=null
get public.key
```

- The **first 2 hex characters** (1 byte) are what apps and contact lists show. There are only 256 of these, so duplicates turn up quickly in any busy area.
- The **first 4 hex characters** (2 bytes) are what `path.hash.mode 1` stamps into routing paths. This is the one that has to be unique. Two repeaters sharing it both answer to the same path entry and both retransmit, which causes routing issues.

### 2. Back Up the Key You Already Have

Before changing anything, save the private key. It's the only way to restore this repeater's identity after a flash erase, or to move that identity onto replacement hardware.

```bash path=null start=null
get prv.key
```

### 3. Check It Against the Repeaters You Can Hear

Collisions only cause problems between repeaters in range of each other. So the check that counts is a local one. Ask your own node what it actually hears:

```bash path=null start=null
neighbors
```

Each line reads `<8 hex chars>:<seconds since heard>:<SNR>`, so `a1b2c530:143:8` is a neighbor whose key starts `a1b2c530`, heard 143 seconds ago. That last number is SNR times four, so halve it twice; `8` means 2 dB. Compare the **first four characters** of each line against your own, and run this from your repeater once it's on the air.

You'll see roughly the eight most recently heard, even though the repeater tracks more than that.

Your companion app's contact list is worth checking too — it collects every repeater it has heard an advert from, which usually reaches further than a single node's neighbour table.

If `neighbors` replies `-none-`, either nothing has been heard yet or the neighbour table isn't compiled into that variant; fall back to the app contact list.

[MeshMapper](https://meshmapper.net/) is another way to see what's already on the air in your region. However you go about it, the goal is the same: no collision with the repeaters near you.

### 4. Generate and Apply a Replacement Key

There is no on-device key generation command, so this step happens in the browser. Open the [MeshCore config tool](https://config.meshcore.io/) in a Chromium-based browser — it uses Web Serial, same as the flasher — and connect to the repeater.

Click **Edit** (the pencil icon) next to Public Key, enter the four-character prefix you claimed, click **Generate**, then **Use This Key** once it finishes.

:::tip Set your own prefix
Avoiding collisions is the requirement; picking a prefix you actually recognise is the bonus — your callsign, your initials, anything that makes your repeater easy to spot in a contact list. The [MeshCore Key Generator](https://gessaman.com/mc-keygen/) will grind keys until it finds one starting with the characters you want, entirely in your browser, so your keys never leave your device.

To apply a key from it, connect through USB serial or log in to the repeater from a companion node and run:

```bash path=null start=null
set prv.key <your_private_key>
reboot
```
:::

### 5. Reboot and Verify

Back in the Web Serial console, reboot and confirm the new prefix took.

```bash path=null start=null
reboot
get public.key
```

The first four hex characters should be the prefix you claimed. Back up this new key as well, it's replaced the key from step 2.

```bash path=null start=null
get prv.key
```

To restore a saved key later paste it back and reboot:

```bash path=null start=null
set prv.key <128_hex_characters>
reboot
```

The firmware validates the key before accepting it and replies `OK, reboot to apply! New pubkey: ...`. If you see `Error, bad key`, check you copied all 128 characters.

## Delay Profiles

Higher elevation nodes wait longer before retransmitting, letting local nodes handle nearby traffic first. The network self-organizes without manual routing. Choose the profile that best matches your repeater's location.

### INFRASTRUCTURE — Highest Elevation
Tall fixed infrastructure such as water towers, cell towers, or commercial rooftops with clear line of sight across the area. Backbone of the MichMesh network (e.g. W8CMN sites). 20+ neighbors typical.

```bash path=null start=null
set txdelay 2
set direct.txdelay 2
set rxdelay 3
```

### ELEVATED — Mid Elevation
Grain elevators, tall barns, silos, or other rural structures with moderate height advantage. Bridges infrastructure nodes to suburban coverage. 10–20 neighbors typical.

```bash path=null start=null
set txdelay 1.5
set direct.txdelay 1
set rxdelay 3
```

### SUBURBAN — Average Elevation
Typical rooftop install serving a neighborhood. 5–10 neighbors typical.

```bash path=null start=null
set txdelay 0.8
set direct.txdelay 0.4
set rxdelay 3
```

### LOCAL — Low Elevation
Indoor, ground-level, or low roof. Only sees a few neighbors. 1–3 neighbors typical.

```bash path=null start=null
set txdelay 0.3
set direct.txdelay 0.1
set rxdelay 3
```

### MOBILE — Variable Elevation
Vehicle, hiking, bike. Always defers to fixed infrastructure.

```bash path=null start=null
set txdelay 2
set direct.txdelay 2
set rxdelay 3
```

## Common Repeater Settings

Apply these after the first-run checklist, regardless of delay profile.

```bash path=null start=null
set path.hash.mode 1
set advert.interval 240
set flood.advert.interval 24
set flood.max 32
set agc.reset.interval 500
set dutycycle 100
set loop.detect moderate
```

- [**path.hash.mode 1**](#pathhashmode-Path-ID-Size): 2-byte path hashes (required for current flood routing)
- [**advert.interval 240**](#advertinterval-Local-Advert-Timer): local advert every 4 hours (neighbors only)
- [**flood.advert.interval 24**](#floodadvertinterval-Network-Wide-Advert-Timer): network-wide advert every 24 hours
- [**flood.max 32**](#floodmax--Flood-Hop-Limit): drops floods past 32 hops to match `path.hash.mode 1`
- [**agc.reset.interval 500**](#agcresetinterval--Radio-Deafness-Prevention): resets radio AGC every ~8 min to prevent deafness from RF interference
- [**loop.detect moderate**](#loopdetect-Packet-Storm-Protection): drops a flood that already carries this repeater's hash
- [**dutycycle 100**](#dutycycle--Airtime-Throttle): removes the 50% airtime throttle the repeater firmware ships with
- **guest.password**: left alone on purpose. It defaults to blank, which is what lets community members log in as guests and query repeater status

## Full Settings Audit

A deeper audit than the first-run checklist. Run this before and after a field install to verify everything persisted.

You do not need to be at the repeater for most of this. A companion node logged in as admin can run it over the mesh. Only `stats-core`, `stats-radio` and `stats-packets` need a direct USB connection.

**Serial connection settings:** 115200 baud, 8 data bits, 1 stop bit, no parity, no flow control. The line ending has to include a carriage return, so CR or CRLF both work. LF on its own does not: the firmware discards it and your command never runs.

### Identify and Time-Sync

```bash path=null start=null
ver
board
clock
clock sync
```

### Confirm Radio and Identity

```bash path=null start=null
get name
get role
get radio
get tx
get dutycycle
get repeat
get path.hash.mode
get loop.detect
get public.key
```

### Check Location and Adverts

```bash path=null start=null
get lat
get lon
get advert.interval
get flood.advert.interval
get flood.max
get flood.max.advert
```

### Audit Owner and Delay Tuning

```bash path=null start=null
get owner.info
get rxdelay
get txdelay
get direct.txdelay
```

### Observe Health and Neighbors

```bash path=null start=null
stats-core
stats-radio
stats-packets
discover.neighbors
neighbors
```

### Optional Site-Specific Checks

Only run these when the hardware or install actually uses bridge mode, GPS, or power-saving.

```bash path=null start=null
# Bridge parameters
get bridge.enabled
get bridge.delay
get bridge.source
get bridge.baud

# GPS state
gps on
gps sync
gps off

# Power saving
powersaving on
powersaving off
```

---

*This guide is adapted from the [Colorado Mesh Repeater Setup Guide](https://meshcore.coloradomesh.org/guides/repeater-setup), with additional recommendations from the [Bay Area MeshCore Repeater Setup Guide](https://bayareameshcore.org/repeater-setup/) and the [PugetMesh Repeater Setup Guide](https://pugetmesh.org/meshcore/repeater_setup/). Thank you to the Colorado Mesh, Bay Area MeshCore and PugetMesh communities for the thorough documentation.*
