---
sidebar_label: Repeater Setup
---
# Repeater Setup Guide

So you've decided to run a repeater. Nice. This guide gets a MeshCore repeater online, tagged with the right Michigan regions, tuned, and verified.

- **[Quick Start](#quick-start)**: every command a new Michigan repeater needs, in order. Start here.
- **[Step-by-Step Setup](#step-by-step-setup)**: the same steps explained one at a time.
- **[Regions](#regions)**: which regions to carry and why.
- **[Claim a Unique Public Key Prefix](#claim-a-unique-public-key-prefix)**: do this before the repeater goes on the air.
- **[Delay Profiles](#delay-profiles)**: pick one that matches the repeater's height.
- **[Settings Reference](#settings-reference)**: what each setting does.
- **[Full Settings Audit](#full-settings-audit)**: check everything before and after a field install.

## Before You Start

- **Flash Repeater firmware** via the [web flasher](https://flasher.meshcore.io/). Use a Chromium-based browser, since the flasher needs the Web Serial API. This guide requires firmware **1.16 or later**; if a repeater is running anything older, upgrade it first.
- **Mount high with line of sight** and use a real external antenna. Elevation and antenna quality matter more than transmit power.
- **Use a stable power supply**: wall adapter, POE, or solar with battery backup. Avoid bus-powered USB hubs.
- **Connect over USB** with the Web Serial console at [config.meshcore.io](https://config.meshcore.io).

:::note nRF52 boards only: Install OTAFIX
Flash [OTAFIX](https://github.com/oltaco/Adafruit_nRF52_Bootloader_OTAFIX) before the repeater firmware as it falls back to DFU mode when an OTA update fails. See the [install instructions here](https://blog.meshcore.io/2026/04/06/otafix-bootloader).
:::

:::warning CLI Syntax
The MeshCore CLI uses **spaces**, not `=`. Typing `set path.hash.mode = 1` can silently fail or store garbage. Always use `set path.hash.mode 1`.
:::

## Quick Start {#quick-start}

The full setup for a new repeater on firmware 1.16 or later. Replace everything in `<angle brackets>`, and swap the region line for your area (see [Pick Your Regions](#pick-your-regions)). Each block links to a step below that explains it.

```bash path=null start=null
# 1. Confirm firmware and radio (expect role = Repeater, 910.525 / 62.5 / 7 / 5)
ver
get role
get radio

# 2. Identity and security
set name <YourRepeaterName>
set lat <42.7336>
set lon <-84.5555>
set owner.info <your_contact_details>|michmesh.com/mcr
password <your_admin_password>

# 3. Michigan network standards
set path.hash.mode 1
set advert.interval 240
set flood.advert.interval 24
set flood.max 32
set agc.reset.interval 500
set dutycycle 100
set loop.detect moderate

# 4. Regions (Grand Rapids example: use your own subregion / local region)
region def midwest mi mi-west grr
region default mi
region save
set flood.max.unscoped 3

# 5. Delay profile (SUBURBAN shown: pick yours from Delay Profiles)
set txdelay 0.8
set direct.txdelay 0.4
set rxdelay 3

# 6. Clock, then reboot and verify
clock sync
reboot
```

After it reboots, reconnect and run `clock`, `region`, and `get public.key`. Before the repeater goes up, [check its public key prefix](#claim-a-unique-public-key-prefix) for collisions.

:::caution Clock Sync Required
Repeaters boot with an old date. Without a correct clock, relayed message timestamps will be wrong. With GPS-capable firmware and hardware, run `gps on` then `gps sync`. Otherwise run `clock sync` from the companion app or Web Serial after every reboot or power cycle.
:::

## Step-by-Step Setup {#step-by-step-setup}

### 1. Confirm Firmware and Role {#step-1-firmware}

Repeater firmware sets the role automatically. You should see `role = Repeater`. If `ver` shows a version older than 1.16, [upgrade](https://flasher.meshcore.io/) before going further: the region commands in this guide need it.

```bash path=null start=null
ver
board
get role
```

### 2. Verify Radio Settings {#step-2-radio}

Read back the radio configuration and confirm it matches the Michigan preset. If you selected **USA/Canada (Recommended)** in the [web flasher](https://flasher.meshcore.io/), it already does:

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

Only if the read-back didn't match, set them manually:

```bash path=null start=null
set radio 910.525,62.5,7,5
set tx <power>
```

### 3. Set Name and Location {#step-3-name}

Set the name the rest of the mesh will see, and the repeater's coordinates. Location isn't required, but it's what lets everyone see where coverage already exists and where the gaps are. Coordinates are decimal degrees, not degrees/minutes/seconds.

```bash path=null start=null
set name <YourRepeaterName>
set lat <42.7336>
set lon <-84.5555>
```

### 4. Set Owner Info {#step-4-owner}

Free-text contact details so somebody can reach you about the node: an email address, a Discord handle, an amateur radio callsign, or whatever else will actually reach you. Optional, but a repeater nobody can contact is a repeater nobody can tell you is misbehaving. `|` characters become line breaks.

```bash path=null start=null
set owner.info <your_contact_details>|michmesh.com/mcr
```

End it with `|michmesh.com/mcr`, a short link to this page, so anyone who looks up your repeater can find the Michigan setup standard. Keep the link in owner info rather than the repeater name: once location is set, adverts only carry the first 23 characters of the name, and the link would crowd out or truncate it.

### 5. Set an Admin Password {#step-5-password}

Repeater firmware ships with the admin password set to the literal string `password`. Until you change it, anyone in radio range can log in over the mesh and reconfigure your node. Change it before the repeater goes up.

```bash path=null start=null
password <your_admin_password>
```

Leave `guest.password` alone on purpose. It defaults to blank, which is what lets community members log in as guests and query repeater status.

### 6. Apply Michigan Network Standards {#step-6-standards}

These apply to every Michigan repeater regardless of location or height.

```bash path=null start=null
set path.hash.mode 1
set advert.interval 240
set flood.advert.interval 24
set flood.max 32
set agc.reset.interval 500
set dutycycle 100
set loop.detect moderate
```

- [**path.hash.mode 1**](#path-hash-mode): 2-byte path hashes. Michigan standard since May 20, 2026; set it on your companion too.
- [**advert.interval 240**](#advert-interval): local advert every 4 hours (neighbors only)
- [**flood.advert.interval 24**](#flood-advert-interval): network-wide advert every 24 hours
- [**flood.max 32**](#flood-max): drops floods past 32 hops to match `path.hash.mode 1`
- [**agc.reset.interval 500**](#agc-reset-interval): resets radio AGC every ~8 min to prevent deafness from RF interference
- [**dutycycle 100**](#dutycycle): removes the 50% airtime throttle the repeater firmware ships with
- [**loop.detect moderate**](#loop-detect): drops a flood that already carries this repeater's hash

### 7. Set Regions {#step-7-regions}

Tag the repeater with the full region ancestry for the area it serves, set its default scope to `mi`, and cap unscoped floods at 3 hops. See [Regions](#regions) for what to carry.

```bash path=null start=null
region def midwest mi <subregion> <local_region>
region default mi
region save
set flood.max.unscoped 3
```

Leave off `<local_region>` if your area doesn't have one yet.

### 8. Pick a Delay Profile {#step-8-delay}

Choose the [delay profile](#delay-profiles) that matches the repeater's elevation and apply its three commands.

### 9. Sync the Clock {#step-9-clock}

```bash path=null start=null
# GPS-capable firmware + hardware:
gps on
gps sync

# Otherwise: companion app or Web Serial, after every reboot:
clock sync
```

### 10. Reboot and Verify {#step-10-verify}

Reboot, reconnect serial, then confirm settings persisted, the regions took, and time is correct.

```bash path=null start=null
reboot
clock
get role
get path.hash.mode
get flood.max.unscoped
region
```

## Regions {#regions}

Regions let traffic be scoped so it only floods as far as it's useful. A repeater forwards scoped traffic only for regions it carries, so the regions you configure decide what your repeater will pass on. Michigan's region names and county assignments come from the draft [Michigan MeshCore Regions RFC](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning), developed by Michigan operators.

### The Michigan Hierarchy {#region-hierarchy}

```text
midwest
└── mi
    ├── mi-west
    │   ├── grr        Grand Rapids
    │   ├── azo        Kalamazoo
    │   └── mkg        Muskegon (example)
    ├── mi-central
    │   ├── thumb
    │   └── midstate
    ├── mi-east
    │   └── det        Detroit (example)
    ├── mi-north       Northern Lower Peninsula
    │   └── tvc        Traverse City (example)
    └── mi-upper       Upper Peninsula
        └── mqt        Marquette (example)
```

Local regions marked *example* aren't settled yet. Check with operators near you before carrying one, and if your area doesn't have a local region, stop at the subregion.

### Pick Your Regions {#pick-your-regions}

A repeater carries **every level** above it: `midwest`, `mi`, its subregion, and its local region if there is one. MeshCore does not inherit regions, so each one has to be configured. Find your county below for a default subregion:

| Subregion | Counties |
| --- | --- |
| `mi-west` | Allegan, Barry, Berrien, Branch, Calhoun, Cass, Ionia, Kalamazoo, Kent, Montcalm, Muskegon, Newaygo, Oceana, Ottawa, St. Joseph, Van Buren |
| `mi-central` | Arenac, Bay, Clinton, Eaton, Genesee, Gladwin, Gratiot, Hillsdale, Huron, Ingham, Iosco, Isabella, Jackson, Midland, Ogemaw, Saginaw, Sanilac, Shiawassee, Tuscola |
| `mi-east` | Lapeer, Lenawee, Livingston, Macomb, Monroe, Oakland, St. Clair, Washtenaw, Wayne |
| `mi-north` | Alcona, Alpena, Antrim, Benzie, Charlevoix, Cheboygan, Clare, Crawford, Emmet, Grand Traverse, Kalkaska, Lake, Leelanau, Manistee, Mason, Mecosta, Missaukee, Montmorency, Osceola, Oscoda, Otsego, Presque Isle, Roscommon, Wexford |
| `mi-upper` | Alger, Baraga, Chippewa, Delta, Dickinson, Gogebic, Houghton, Iron, Keweenaw, Luce, Mackinac, Marquette, Menominee, Ontonagon, Schoolcraft |

The county table is a starting point, not a border. A repeater carries the subregion of the area it **actually covers**: a hilltop site in Ionia County whose footprint is mostly Grand Rapids belongs in `mi-west` and `grr`. If operators in your area have agreed on something different, that agreement wins.

Examples:

| Repeater | Command |
| --- | --- |
| Grand Rapids | `region def midwest mi mi-west grr` |
| Kalamazoo | `region def midwest mi mi-west azo` |
| Lansing | `region def midwest mi mi-central` |
| Detroit | `region def midwest mi mi-east` |
| Traverse City | `region def midwest mi mi-north` |
| Marquette | `region def midwest mi mi-upper` |

### Default Scope: `mi` {#region-default}

`region default mi` scopes the repeater's own adverts statewide. Every Michigan repeater should carry `mi` and use it as its default: a repeater without `mi` won't forward `mi`-scoped traffic, which leaves anyone who scopes to `mi` with less reach than unscoped users.

### Cap Unscoped Floods {#flood-max-unscoped}

Traffic with no region, which includes everything from a companion that hasn't set a default scope, is forwarded by every repeater no matter which regions it carries. Out-of-state traffic ducting across Lake Michigan is unscoped. Regions do nothing about it on their own.

```bash path=null start=null
set flood.max.unscoped 3
get flood.max.unscoped
```

This drops an unscoped flood once its path already carries 3 hops. A new user's adverts and first messages still reach their local repeaters, but a packet that's been repeated three times before crossing the lake doesn't get a fourth. Companions with a default scope set are unaffected. Requires firmware 1.16.

Don't block unscoped traffic outright with `region denyf *`. Every new user starts out unscoped, and blocking them silences them until they find a setting they don't know exists.

:::note Sparse areas
Where a new user would need more than 3 hops to reach anyone (much of the northern Lower Peninsula and the Upper Peninsula today), it's reasonable to leave the cap at its default until coverage fills in. If you do, say so in the group.
:::

### Repeaters on a Boundary {#region-boundary}

A repeater can carry more than one subregion. A site on the `mi-west` / `mi-central` line that really serves both can carry both, and then it forwards traffic scoped to either. That makes it a **bridge**, and bridges are a network decision, not a site decision:

- Carry a neighboring subregion only if you serve companions there. Hearing a neighbor's repeater on a good day isn't coverage.
- A few deliberate bridges per boundary, announced in the group, beat every edge repeater quietly carrying both.
- On a bridge, set `region default` to the **home** subregion where most of the footprint is, not `mi`. Setting `mi` to "cover both" makes its adverts statewide.
- Always set `flood.max.unscoped 3` on a bridge. It's where a leaked unscoped flood would pick up a fresh set of hops.

```bash path=null start=null
region def midwest mi mi-west grr
region def midwest mi mi-central
region default mi-west
region save
```

### Companion Settings {#region-companion}

Companion setup (default scope, discovering regions, and channel scopes) is on [Getting Started](./01-Getting-Started.md#set-your-region), with screenshots for both apps.

## Claim a Unique Public Key Prefix {#claim-a-unique-public-key-prefix}

Repeaters identify each other by the leading bytes of their public key. The firmware generates that key at random on first boot, and nothing stops it from landing on a prefix a nearby repeater already uses. See [Public Key Prefix](#public-key-prefix) for why the 2-byte prefix matters.

:::warning Prior to going online
The public key *is* the repeater's identity. Rekeying means everyone who already has this repeater as a contact has to re-add it, and admin sessions tied to the old identity stop working. Check your prefix now: rekeying a repeater that's already carrying traffic disrupts everyone using it.
:::

### 1. Read Your Current Prefix {#prefix-1-read}

```bash path=null start=null
get public.key
```

- The **first 2 hex characters** (1 byte) are what apps and contact lists show. There are only 256 of these, so duplicates turn up quickly in any busy area.
- The **first 4 hex characters** (2 bytes) are what `path.hash.mode 1` stamps into routing paths. This is the one that has to be unique. Two repeaters sharing it both answer to the same path entry and both retransmit, which causes routing issues.

### 2. Back Up the Key You Already Have {#prefix-2-backup}

Before changing anything, save the private key. It's the only way to restore this repeater's identity after a flash erase, or to move that identity onto replacement hardware.

```bash path=null start=null
get prv.key
```

### 3. Check It Against the Repeaters You Can Hear {#prefix-3-check}

Collisions only cause problems between repeaters in range of each other, so the check that counts is a local one. Ask your own node what it actually hears:

```bash path=null start=null
neighbors
```

Each line reads `<8 hex chars>:<seconds since heard>:<SNR>`, so `a1b2c530:143:8` is a neighbor whose key starts `a1b2c530`, heard 143 seconds ago. That last number is SNR times four, so halve it twice; `8` means 2 dB. Compare the **first four characters** of each line against your own, and run this from your repeater once it's on the air.

You'll see roughly the eight most recently heard, even though the repeater tracks more than that. If `neighbors` replies `-none-`, either nothing has been heard yet or the neighbour table isn't compiled into that variant.

Your companion app's contact list is worth checking too. It collects every repeater it has heard an advert from, which usually reaches further than a single node's neighbour table. [MeshMapper](https://meshmapper.net/) is another way to see what's already on the air in your region. However you go about it, the goal is the same: no collision with the repeaters near you.

### 4. Generate and Apply a Replacement Key {#prefix-4-generate}

There is no on-device key generation command, so this step happens in the browser. Open the [MeshCore config tool](https://config.meshcore.io/) in a Chromium-based browser and connect to the repeater.

Click **Edit** (the pencil icon) next to Public Key, enter the four-character prefix you claimed, click **Generate**, then **Use This Key** once it finishes.

:::tip Set your own prefix
Avoiding collisions is the requirement; picking a prefix you actually recognise is the bonus: your callsign, your initials, anything that makes your repeater easy to spot in a contact list. The [MeshCore Key Generator](https://gessaman.com/mc-keygen/) will grind keys until it finds one starting with the characters you want, entirely in your browser, so your keys never leave your device.

To apply a key from it, connect through USB serial or log in to the repeater from a companion node and run:

```bash path=null start=null
set prv.key <your_private_key>
reboot
```
:::

### 5. Reboot and Verify {#prefix-5-verify}

Reboot and confirm the new prefix took.

```bash path=null start=null
reboot
get public.key
```

The first four hex characters should be the prefix you claimed. Back up this new key as well, since it replaced the key from step 2.

```bash path=null start=null
get prv.key
```

To restore a saved key later, paste it back and reboot:

```bash path=null start=null
set prv.key <128_hex_characters>
reboot
```

The firmware validates the key before accepting it and replies `OK, reboot to apply! New pubkey: ...`. If you see `Error, bad key`, check you copied all 128 characters.

## Delay Profiles {#delay-profiles}

Higher elevation nodes wait longer before retransmitting, letting local nodes handle nearby traffic first. The network self-organizes without manual routing. Choose the profile that best matches your repeater's location.

| Profile | Typical site | Neighbors | `txdelay` | `direct.txdelay` | `rxdelay` |
| --- | --- | --- | --- | --- | --- |
| [INFRASTRUCTURE](#delay-infrastructure) | Water tower, cell tower, commercial rooftop | 20+ | 2 | 2 | 3 |
| [ELEVATED](#delay-elevated) | Grain elevator, silo, tall barn | 10–20 | 1.5 | 1 | 3 |
| [SUBURBAN](#delay-suburban) | Typical rooftop | 5–10 | 0.8 | 0.4 | 3 |
| [LOCAL](#delay-local) | Indoor, ground level, low roof | 1–3 | 0.3 | 0.1 | 3 |
| [MOBILE](#delay-mobile) | Vehicle, hiking, bike | varies | 2 | 2 | 3 |

### INFRASTRUCTURE: Highest Elevation {#delay-infrastructure}
Tall fixed infrastructure such as water towers, cell towers, or commercial rooftops with clear line of sight across the area. Backbone of the MichMesh network (e.g. W8CMN sites).

```bash path=null start=null
set txdelay 2
set direct.txdelay 2
set rxdelay 3
```

### ELEVATED: Mid Elevation {#delay-elevated}
Grain elevators, tall barns, silos, or other rural structures with moderate height advantage. Bridges infrastructure nodes to suburban coverage.

```bash path=null start=null
set txdelay 1.5
set direct.txdelay 1
set rxdelay 3
```

### SUBURBAN: Average Elevation {#delay-suburban}
Typical rooftop install serving a neighborhood.

```bash path=null start=null
set txdelay 0.8
set direct.txdelay 0.4
set rxdelay 3
```

### LOCAL: Low Elevation {#delay-local}
Indoor, ground-level, or low roof. Only sees a few neighbors.

```bash path=null start=null
set txdelay 0.3
set direct.txdelay 0.1
set rxdelay 3
```

### MOBILE: Variable Elevation {#delay-mobile}
Vehicle, hiking, bike. Always defers to fixed infrastructure.

```bash path=null start=null
set txdelay 2
set direct.txdelay 2
set rxdelay 3
```

## Settings Reference {#settings-reference}

### path.hash.mode: Path ID Size {#path-hash-mode}

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

### Public Key Prefix {#public-key-prefix}
A repeater stamps itself into a packet's routing path using the leading bytes of its public key (its **prefix**) and matches inbound direct packets against that same prefix. `path.hash.mode` sets the width: mode `1` means 2 bytes, so four hex characters out of 65,536 possibilities.

Don't confuse that with the 1-byte prefix apps display. Destination addressing is a fixed 1 byte regardless of `path.hash.mode`, and with only 256 values duplicates are routine; the firmware handles them by attempting decryption, so they're cosmetic. The 2-byte path prefix is the one that must be unique: two repeaters sharing it both claim the same path entry and both retransmit. The prefix is part of the keypair, so claiming a different one means generating a new key.

### txdelay / direct.txdelay {#txdelay}
Controls how long a repeater waits before retransmitting a received packet. The firmware works out `unit = estimated_airtime × txdelay`, then picks the actual delay uniformly at random between `0` and `5 × unit`. Higher values create a wider random window, meaning more deference to other nodes. `direct.txdelay` is the same but for routed point-to-point messages (usually set lower for faster delivery). Both accept `0`–`2`; repeater firmware ships at `txdelay 0.5` and `direct.txdelay 0.3`.

### rxdelay: SNR-Based Path Selection {#rxdelay}
Only affects flood packets. Direct (point-to-point) packets are always processed immediately. Delays processing of floods based on signal quality (SNR). Strong signal = processed immediately. Weak signal = delayed and likely dropped as a duplicate. The mesh naturally prefers the strongest, cleanest paths without manual routing. It accepts `0`–`20` and ships **off** (`0`).

### agc.reset.interval: Radio Deafness Prevention {#agc-reset-interval}
Periodically resets the LoRa radio's Automatic Gain Control (AGC) to prevent "deafness" caused by strong out-of-band RF interference. Without this, the SX1262 AGC can lock up, clamping the noise floor at -120 dBm and making the repeater unable to hear weaker signals until rebooted. Especially important for repeaters near broadcast towers or other RF sources.

### dutycycle: Airtime Throttle {#dutycycle}
Repeater firmware ships with an airtime budget factor of `1.0`. The dispatcher computes `duty_cycle = 1 / (1 + airtime_factor)`, so that default works out to **50%**: the repeater accrues transmit budget at half of elapsed time and defers sending once it runs dry. The US 915 MHz ISM band has no duty cycle limit, so a repeater left at the default is giving away half its airtime. `set dutycycle 100` drives the factor to `0` and removes the throttle.

### loop.detect: Packet Storm Protection {#loop-detect}
Before repeating a flood, the repeater counts how many times its own hash already appears in that packet's path and drops the packet once the count hits a threshold. Defaults to `off`. The three levels set how many repeats it tolerates, and the threshold tightens as the hash gets wider:

| Level | 1-byte | 2-byte | 3-byte |
| --- | --- | --- | --- |
| `minimal` | 4 | 2 | 1 |
| `moderate` | 2 | 1 | 1 |
| `strict` | 1 | 1 | 1 |

### advert.interval: Local Advert Timer {#advert-interval}
How often the repeater sends a zero-hop advert, heard only by nodes in direct range. Accepts 60–240 minutes and defaults to `0`, which is off.

### flood.advert.interval: Network-Wide Advert Timer {#flood-advert-interval}
How often the repeater floods an advert across the whole mesh, so nodes out of direct range can still find it. Accepts 3–168 hours and defaults to `47`.

### flood.max: Flood Hop Limit {#flood-max}
Drops a flood packet once its recorded path has reached this many hops. Repeater firmware defaults to `64`.

Worth knowing before you tune it: a packet's path field holds 64 bytes total, so at `path.hash.mode 1` (2-byte hashes) a flood can only ever carry **32 hops** before it runs out of room. Setting `32` costs nothing and matches what other networks publish, but genuinely bounding flood propagation would need a value well below it. For unscoped traffic, [`flood.max.unscoped`](#flood-max-unscoped) is what does that.

## Full Settings Audit {#full-settings-audit}

A deeper audit than the setup steps. Run this before and after a field install to verify everything persisted.

You do not need to be at the repeater for most of this. A companion node logged in as admin can run it over the mesh. Only `stats-core`, `stats-radio` and `stats-packets` need a direct USB connection.

**Serial connection settings:** 115200 baud, 8 data bits, 1 stop bit, no parity, no flow control. The line ending has to include a carriage return, so CR or CRLF both work. LF on its own does not: the firmware discards it and your command never runs.

### Identify and Time-Sync {#audit-identify}

```bash path=null start=null
ver
board
clock
clock sync
```

### Confirm Radio and Identity {#audit-radio}

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

### Check Regions {#audit-regions}

```bash path=null start=null
region
get flood.max.unscoped
```

From the app, **Discover Regions (Scan Local)** should show every nearby configured repeater reporting `mi` and its ancestry.

### Check Location and Adverts {#audit-location}

```bash path=null start=null
get lat
get lon
get advert.interval
get flood.advert.interval
get flood.max
get flood.max.advert
```

### Audit Owner and Delay Tuning {#audit-delay}

```bash path=null start=null
get owner.info
get rxdelay
get txdelay
get direct.txdelay
```

### Observe Health and Neighbors {#audit-health}

```bash path=null start=null
stats-core
stats-radio
stats-packets
discover.neighbors
neighbors
```

### Optional Site-Specific Checks {#audit-optional}

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

*This guide is adapted from the [Colorado Mesh Repeater Setup Guide](https://meshcore.coloradomesh.org/guides/repeater-setup), with additional recommendations from the [Bay Area MeshCore Repeater Setup Guide](https://bayareameshcore.org/repeater-setup/) and the [PugetMesh Repeater Setup Guide](https://pugetmesh.org/meshcore/repeater_setup/). Region guidance comes from the [Michigan MeshCore Regions RFC](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning). Thank you to the Colorado Mesh, Bay Area MeshCore and PugetMesh communities for the thorough documentation.*
