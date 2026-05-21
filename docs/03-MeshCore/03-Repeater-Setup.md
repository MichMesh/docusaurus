---
sidebar_label: Repeater Setup
---
# Repeater Setup Guide

So you've decided to run a repeater — nice. This guide walks you through getting a MeshCore repeater node online, tuned, and verified. Much of this is adapted from the excellent [Colorado Mesh Repeater Setup Guide](https://meshcore.coloradomesh.org/guides/repeater-setup) and adjusted for MichMesh.

## Before You Start

If you flashed with Repeater firmware from the [MeshCore Web Flasher](https://flasher.meshcore.io/), the repeater role is already baked in. Getting online is mostly about verifying your radio preset and syncing the clock.

**The essentials:**

- **Flash Repeater firmware** via the web flasher — this sets the role automatically.
- **Mount high with line of sight** and use a real external antenna. Elevation and antenna quality matter more than transmit power.
- **Use a stable power supply** — wall adapter, POE, or solar with battery backup. Avoid bus-powered USB hubs.
- **Verify and tune via USB / Web Serial** — walk through the checklist below.

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
Controls how long a repeater waits before retransmitting a received packet. The formula is `unit = estimated_airtime × txdelay`, then `delay = random(0..5) × unit`. Higher values create a wider random window, meaning more deference to other nodes. `direct.txdelay` is the same but for routed point-to-point messages (usually set lower for faster delivery).

### rxdelay — SNR-Based Path Selection
Only affects flood packets — direct (point-to-point) packets are always processed immediately. Delays processing of floods based on signal quality (SNR). Strong signal = processed immediately. Weak signal = delayed and likely dropped as a duplicate. The mesh naturally prefers the strongest, cleanest paths without manual routing.

### agc.reset.interval — Radio Deafness Prevention
Periodically resets the LoRa radio's Automatic Gain Control (AGC) to prevent "deafness" caused by strong out-of-band RF interference. Without this, the SX1262 AGC can lock up, clamping the noise floor at -120 dBm and making the repeater unable to hear weaker signals until rebooted. Especially important for repeaters near broadcast towers or other RF sources.

## First-Run CLI Checklist

The minimum steps after flashing Repeater firmware. Use the Web Serial console.

### 1. Confirm Firmware and Role

Repeater firmware sets the role automatically. You should see `role = Repeater`.

```bash path=null start=null
ver
board
get role
```

### 2. Verify Radio Settings

Read back the radio configuration and confirm it matches your network's preset. If you selected **USA/Canada (Recommended)** during flashing, you should be good.

```bash path=null start=null
get radio
get freq
get tx
```

### 3. Apply Settings (Only If Read-Back Didn't Match)

If step 2 showed incorrect values, set them manually. Adjust these to match your network's agreed-upon preset.

```bash path=null start=null
set freq <your_frequency>
set radio bw <bandwidth> sf <spreading_factor> cr <coding_rate>
set tx <power>
```

### 4. Enable 2-Byte Path Hashes

Current MeshCore flood routing expects `path.hash.mode 1`. Older firmware defaulted to mode 0 (1-byte) and will look like packet loss.

**Michigan settled on `path.hash.mode 1` as of May 20, 2026. Make sure to set this on any repeater. Note that `path.hash.mode 0` will still work on a companion node, but you will not be able to see any repeaters in apps.**

```bash path=null start=null
set path.hash.mode 1
get path.hash.mode
```

### 5. Sync the Clock

```bash path=null start=null
# GPS-capable firmware + hardware:
gps on
gps sync

# Otherwise — companion app or Web Serial, after every reboot:
clock sync
```

### 6. Reboot and Verify

Reboot, reconnect serial, then confirm settings persisted and time is correct.

```bash path=null start=null
reboot
clock
get role
```

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
set txdelay 3
set direct.txdelay 2.5
set rxdelay 3
```

## Common Repeater Settings

Apply these after the first-run checklist, regardless of delay profile. Use spaces, never `=`.

```bash path=null start=null
set path.hash.mode 1
set advert.interval 240
set flood.advert.interval 24
set agc.reset.interval 500
set guest.password
```

- **path.hash.mode 1** — 2-byte path hashes (required for current flood routing)
- **advert.interval 240** — local advert every 4 hours (neighbors only)
- **flood.advert.interval 24** — network-wide advert every 24 hours
- **agc.reset.interval 500** — resets radio AGC every ~8 min to prevent deafness from RF interference
- **guest.password (blank)** — lets community members query repeater status

## USB Serial Preflight

A deeper audit than the first-run checklist. Run this before and after a field install to verify everything persisted.

**Serial connection settings:** 115200 baud, 8 data bits, 1 stop bit, no parity, no flow control, CRLF line ending.

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
get freq
get tx
get af
get repeat
get path.hash.mode
get public.key
```

### Check Location and Adverts

```bash path=null start=null
get lat
get lon
get advert.interval
get flood.advert.interval
get flood.max
get allow.read.only
```

### Audit Owner and Delay Tuning

```bash path=null start=null
get owner.info
get acl
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
neighbor
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

*This guide is adapted from the [Colorado Mesh Repeater Setup Guide](https://meshcore.coloradomesh.org/guides/repeater-setup). Thank you to the Colorado Mesh community for the thorough documentation.*
