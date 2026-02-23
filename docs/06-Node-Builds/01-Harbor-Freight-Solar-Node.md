---
sidebar_label: $30 HF Solar Node
---
# $30 Harbor Freight Solar Node

A budget solar-powered mesh node using a Harbor Freight solar spotlight as the enclosure and power source. Works with both **Meshtastic** and **MeshCore** firmware. Total cost comes in around $30.

3D printed mount files and additional photos are available on the [Thingiverse listing](https://www.thingiverse.com/thing:7135669).

![Completed Harbor Freight solar node mounted on a deck railing](../images/node-builds/hf-solar-node-complete.jpg)

## Bill of Materials

| Component | Approx. Cost |
|---|---|
| Harbor Freight Solar Spotlight (Model 57704) | $9 |
| Seeed XIAO nRF52840 kit | $14 |
| Antenna kit (2-pack) | $12 |
| TP4056 charging module (10-pack) | $8 |
| **Total** | **~$30** |

## Assembly Notes

### Enclosure
The Harbor Freight solar spotlight housing provides a dual-chamber waterproof design. The inner and outer box arrangement means any water that gets in drains out rather than pooling around your electronics.

### Solar Charging
Discard the stock solar charging circuit board that comes with the spotlight — it is not suitable for directly charging and powering a node. Replace it with a **TP4056 module**, which provides proper charge control for the lithium cell.

### 3D Printed Parts
Several 3D printed parts help with mounting and protection:
- **Wall mount** — for attaching the unit to a wall or post
- **Mounting arm** — adjustable positioning for the solar panel
- **Zip-tie body pocket** — secures the node body to poles or other structures

![Wall mount](../images/node-builds/hf-wall-mount.png) ![Mounting arm](../images/node-builds/hf-mounting-arm.png) ![Zip-tie body pocket](../images/node-builds/hf-zip-tie-mount.png)

STL files for all printed parts are available on the [Thingiverse listing](https://www.thingiverse.com/thing:7135669).

## Battery Upgrade Tip

For more capacity, remove the top and bottom of the stock battery holder to fit a standard **18650 cell**. The 18650 configuration holds up well through winter months provided the panel isn't shaded by trees or structures.

## Firmware Compatibility

This build works with both:
- **Meshtastic** — see the [Meshtastic section](/docs/Meshtastic) for setup guides
- **MeshCore** — see the [MeshCore section](/docs/MeshCore) for setup guides
