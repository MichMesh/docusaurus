---
sidebar_label: Car Solar Node
---
# Car Solar Node

A mag-mounted solar node build for your car! For wardriving, or just for an external node you carry around. The build I am using here in the picture is a T114, with a 3000mah battery. Works with both **Meshtastic** and **MeshCore** firmware.

You can find the 3D printed parts on [Printables](https://www.printables.com/model/994724-low-profile-solar-meshtastic-car-node) - works with SMA and N-type antennas.

This BoM here are what *I* used. You can use your own stuff if it fits and you have a preference. 

## Bill of Materials

| Component | Notes |
|---|---|
| Radio of your choice - I used the T114 but they have a tray for the RAK19007 | ~$30-$43 from RAK store or [Amazon](https://www.amazon.com/dp/B0G4R5KH22) |
| Battery of your choice - 2000-3000mah (keep an eye on the size) | [Amazon](https://www.amazon.com/dp/B0F1FN63HW)
| Antenna (Muzi or an Alfa) | [Amazon - Muzi](https://www.amazon.com/dp/B0D7D6866W) or [Rokland](https://store.rokland.com/products/alfa-aoa-915-5acm-5-dbi-omni-outdoor-915mhz-802-11ah-mini-antenna-for-lora-halow-application)
| Antenna Connector (based on your choice above | [Amazon-N-Type](https://www.amazon.com/dp/B08ZYK5SL9) or [Amazon SMA](https://www.amazon.com/dp/B0FGXNT1MZ?)
| Solar panel | [Amazon](https://www.amazon.com/dp/B0C4L1L1BD)
| 4 Magnets to attach to car / panel | [Amazon](https://www.amazon.com/dp/B0CW5ZVMF6)
| Short USB-A to USB-C cable | [Amazon](https://www.amazon.com/Adiceve-Charging-Durable-Braided-Charger/dp/B0FVXQ4FWK)

## Notes

### Materials
Use ASA or ABS since this will be outside in the weather / sun. **DO NOT USE PLA**. I also recommend a light color as a black node will soak up the heat of the sun.

### Assembly
**SAFETY TIPS** 
- Make sure you have an antenna connected before you power on! 
- Make sure you check the + / - polarity on your board and batteries to make sure they match!

Flash your board with whatever firmware you prefer. Print the upper and lower shells out of ASA or ABS or even Nylon. Something that will stand up to the heat.

Mount the antenna connector into the upper shell. Mount the board and battery onto the lower shell.

Use the screws built into the magnets to connect the magnets to the solar panel - one end will require the two spacers - the other end just goes through the shell.

Connect the USB cable to the underside of the panel and route the cable to the USB-C port on your T114. Coil up any additional cable in the shell.

Place TPU gasket inside of upper shell and press-fit the lower shell inside. Secure with M3x8 screws to seal shut.

![Build Angle 1](../images/node-builds/carsolarnode2.jpg)

![Build Angle 2](../images/node-builds/carsolarnode1.jpg)

