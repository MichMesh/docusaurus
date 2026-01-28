---
sidebar_label: Getting Started
---
# Getting Started
## Flashing Your Device
Using the [MeshCore Web Flasher](https://flasher.meshcore.co.uk/) is similar to the MeshTastic one if you are already familiar with the process with one exception.

- Connect your device to your computer via USB
- Select your device from the list (MichMesh Node is ProMicro nrf52 (faketec))
- Select your node's role type (See list above for explanation)
- Click the Enter DFU Mode, select your device from the pop-up
- IMPORTANT - Click Erase Flash, select your device from the pop-up. This MUST be done if this is a first time MeshCore flash for the device!
- Click Flash, select your device from the pop-up.

## Setting Up Your Device (Companion)
If your device has a screen, like the T114, you will get the bluetooth pin. I suggest paying attention and writing it down because the screen time out on some of these units is quick. If you missed it, simply reset it and it will pop up and give you a new pin. OTHERWISE, the default is 123456.

- Connect via Bluetooth. IF This is a device you previously paired, you'll first want to "forget" the device in your phone's/computer's bluetooth settings.
- Go to Settings (Cog Icon in Android App)
- Set your Name. Unlike MeshTastic, there is only a "Long Name".
- Set your Lat/Long if your node is stationary. Select "Share Position in Advert" if you would like.
- In Radio Settings, select "Choose Preset". Select USA/Canada (Recommended) if in the US.
- Tap the "Check Mark" in the upper right (if on Android). This applies the current settings.
- Bluetooth Settings - Change it to "Custom" and put in a 6 digit pin. If you forget it, you will have to do a delete flash then re-flash. Tap Check mark in upper right (if on Android) then scroll down and reboot. You will need to reconnect to the device (select forget from phone/computers menu first).

From here, it depends on personal preference and if you have any sensors attached. WARNING: This is still new, and there are bugs. Things like environmental and GPS sensors are hit or miss. One may work while the other won't, or niether will. Its a mixed bag at the moment, but a work in progress none the less. IF you get GPS to work, remember anytime the device is rebooted/restarted you will HAVE to reenable GPS Mode in Position settings. The current firmware auto disables on every boot. This is also a setting you must enable in the mentioned submenu, tap that sub-menu's "Check Mark" in the upper right, then leave the submenu and select the "Check Mark" in the upper right in the main settings menu.
