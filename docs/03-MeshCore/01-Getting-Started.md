---
sidebar_label: Getting Started
---
# Getting Started
## Flashing Your Device
Using the [MeshCore Web Flasher](https://flasher.meshcore.io/) is similar to the Meshtastic one if you are already familiar with the process with one exception.

- Connect your device to your computer via USB
- Select your device from the list (MichMesh Node is ProMicro nrf52 (faketec))
- Select your node's role type (see [Node Role Types](./index.md#Node-Role-Types-Dont-be-THAT-person) for an explanation)
- Click the Enter DFU Mode, select your device from the pop-up
- IMPORTANT - Click Erase Flash, select your device from the pop-up. This MUST be done if this is a first time MeshCore flash for the device!
- Click Flash, select your device from the pop-up.

## Setting Up Your Device (Companion)
If your device has a screen, like the Heltec v3/v4 or T114, you will get the bluetooth pin. I suggest paying attention and writing it down because the screen time out on some of these units is quick. If you missed it, simply reset it and it will pop up and give you a new pin. OTHERWISE, the default is 123456.

### Quick Setup by QR (Android) {#quick-setup-by-qr-android}

If you use [MeshCore Hardened](./02-MeshCore-Applications.md#meshcore-hardened), connect your radio in the app and scan this code. It sets the Michigan radio preset (910.525 MHz, 62.5 kHz, SF7, CR 5), 2-byte path hashes, and the Michigan [region](./03-Repeater-Setup.md#regions) tree with `mi` as the [global flood scope](./03-Repeater-Setup.md#mch-default-scope). The app shows you the settings and asks before applying anything.

![QR code with the Michigan MeshCore radio settings, for scanning with MeshCore Hardened](../../static/img/meshcore-michigan-settings-qr.svg)

The code carries no transmit power or channel keys, so it's safe to print or post. Once it's applied, pick up the manual steps below at setting your name.

### Manual Setup

- Connect via Bluetooth. IF This is a device you previously paired, you'll first want to "forget" the device in your phone's/computer's bluetooth settings.
- Go to Settings (Cog Icon in Android App)
- Set your Name. Unlike MeshTastic, there is only a "Long Name".
- Set your Lat/Long if your node is stationary. Select "Share Position in Advert" if you would like.
- In Radio Settings, select "Choose Preset". Select USA/Canada (Recommended) if in the US.
- Tap the "Check Mark" in the upper right (if on Android). This applies the current settings.
- Default scope (companion firmware 1.15+): set it to `mi`. In the MeshCore app (1.43+) that's Settings → Network Settings → Default Region Scope (Experimental Settings in app 1.43), then tap the check mark. In MeshCore Hardened (0.10.11+) it's Settings → Mesh policies → Global flood scope. This keeps your adverts, direct messages, logins and channel messages scoped to Michigan, so repeaters don't cap them as [unscoped traffic](./03-Repeater-Setup.md#flood-max-unscoped). Channels use this default unless you give them their own scope; see [Companion Settings](./03-Repeater-Setup.md#region-companion) to narrow individual channels.
- Bluetooth Settings - Change it to "Custom" and put in a 6 digit pin. Tap Check mark in upper right (if on Android) then scroll down and reboot. You will need to reconnect to the device (select forget from phone/computers menu first).

:::tip Lost Bluetooth PIN
No need to erase and re-flash. On boards with a user button, hold it down within 8 seconds of boot for CLI Rescue mode, then run `set pin <new_pin>` from the Console on the [web flasher](https://flasher.meshcore.io/).
:::

From here, it depends on your personal preference and if you have any sensors attached.

### Sensors

On boards with sensor support built in, the firmware auto-detects common I2C parts: BME280 and BMP280, the AHT and SHT temperature and humidity families, LPS22HB, and the INA power monitors. Wire one up to VCC, GND, SDA and SCL and it shows up on its own.

### GPS

GPS ships disabled. Turn it on under Position settings, tap that sub-menu's "Check Mark" in the upper right, then leave the submenu and select the "Check Mark" in the upper right in the main settings menu.
