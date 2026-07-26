---
sidebar_label: Beta HF Testing
---
This is not yet implemented, but throwing it out to see who is interested in testing. Please join in on the Signal chat or [discord](https://discord.com/channels/1219014776882204685/1530937845643214888). At this point, the doc is just here to get the idea out, not necessarily to be a hard and fast "this is how we do it" doc. It eventually will be that, but right now we are in the r&d phase.

This way we could drop a single HF/LoRa bridge in a node in a smaller mesh to connect to the greater regional mesh. The idea is to create puddles of connectivity with LoRa, connected to a regional HF backhaul.

## What frequences and do I need a licence?
We will start initial testing on the 40m ham bands, but shouldnt pass meshcore traffic in the ham bands. We will start off using the throughput testing tools in the modem73 suite to get started. We will need to figure out which settings work the best at the lowest power, then move to the 6.78mhz ISM band where anyone can join.
### Why not just use the ham bands?
In short, the rules. If we were to use the ham bands we'd have to:
- turn off encryption (we cant)
- monitor 3rd party traffic (back to the encryption thing). 
## Docs/Tools:
- https://docs.meshcore.io/kiss_modem_protocol/
- https://github.com/RFnexus/modem73
## Hardware required
This is not set in stone yet,  but a rough outline:
### Antenna
Too many to choose from. You will want something low to the ground (less than 15 feet) and resonant. A dipole, G5RV, Loop, etc. You may need a little antenna tuner if you dont want to spend the time tuning the antenna.

### QRP radio
- uSDR - some versions have a kenwood style speaker-mic connector on the back that you can hook an AIOC to.
- trUSDX - would require a digirig or getting the USB audio stuff working. 
- LARCSet - cheaper, requires entry level soldering, needs a digirig or a modified AIOC cable
I've ordered a [uSDR/uSDX+ v2](https://www.amazon.com/dp/B0FX2MN4R9) for testing.. I'm trying to figure out the easiest/cheapest build. More news as it comes.
### Audio interface - radio dependent
- [AIOC](https://na6d.com/products/aioc-ham-radio-all-in-one-cable)
- [DigiRig](https://digirig.net/product/digirig-mobile) and cables for your radio
- HomeBrew [CM108](https://www.cantab.net/users/john.wiseman/Documents/CM108_PTT.html) or similar.
## Modem73 settings that should give the bandwidth needed to flood the US LoRa defaults.
- modem:          OFDM
- modulation:  8psk
- Code rate:     5/6
- frame size:    normal
- CSMA:            enabled/on
- threshold:      5db above your noise floor (the grey number roughly averaged over a couple minutes)
- preset:            busy
### On paper the cheapest OTS solution is:
- raspi zero (will need a usb hub hat or otg hub) or any other debian based computer.  memory/cpu usage is small so dont worry much here.
- uSDX - a little more than a truSDX, but has kenwood style connector on back to use an AIOC, which is cheaper than a digirig
- AIOC - Cant use the programming side of it, but can use the audio interface side. You may need to flash it if you get an older one.
### If you can solder and want the cheapest solution.
- computer of some sort.
-  [LARCSet](https://www.hfsignals.com/index.php/larcset/)
- AIOC or [CM108](https://www.amazon.com/NOYITO-Drive-Free-Computer-External-Module/dp/B07CFWZGZB/)

## Thinks we need to figure out
- How do we connect the TCP port to a USB Com port? (port 8000 to /dev/ttyUSB1)

