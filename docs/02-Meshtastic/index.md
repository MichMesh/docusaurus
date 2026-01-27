---
sidebar_label: Meshtastic
---
# What is it?
Meshtastic is one of the easiest meshes to implement. If you have people using it around you, install the app, pair with a node, set your name and region, go!
## What nodes should I get?
That's a big question in a short sentence. What is your use case? I'll list a few out. I am mainly listing OTS solutions, there are tons of builds out there, these are just the easiest. 
- EDC or Every Day Carry: I like the [T1000-e](https://www.amazon.com/SenseCAP-Card-Tracker-T1000-Meshtastic/dp/B0DJ6KGXKB) for EDC. It's small, tough, light, and can run for a couple days between charges if you turn off the GPS. As of writing it only works on Meshtastic and Meshcore. The [Heltec V4](https://www.amazon.com/Heltec-Battery-2-Pack-3000mAh-Antenna/dp/B0FY2WL3MN/) is another solid choice, It works on all 3 major meshes, though it uses more battery. It can easily be setup as a permanant MQTT gateway by connecting it to your home wifi.
- Car node: This is one that you attach outside of your car. If you have access to a 3d printer, you can build [something like this](https://www.printables.com/model/994724-low-profile-solar-meshtastic-car-node) using a [RAK Wisblock meshtastic starter kit](https://www.amazon.com/RAKwireless-WisBlock-Meshtastic-Starter-RAK19007/dp/B0CHKZJK9C/) a battery and solar panel listed on the build page. If you dont have a 3d printer, you can get a [Seed Solar P1](https://www.amazon.com/SenseCAP-Solar-Node-P1-Pro-Communication/dp/B0FMDHBWX8/) and [some magnets](https://www.amazon.com/dp/B0CW64GTG3?) to mount on the roof of you car.
- Solar node for static installations: The [Seed Solar P1](https://www.amazon.com/SenseCAP-Solar-Node-P1-Pro-Communication/dp/B0FMDHBWX8/) is a solid setup, especially if you pair it with a [telescoping flag pole](https://www.amazon.com/VEVOR-30FT-Telescoping-Kit-Flagpole/dp/B0D8P7GT9Q/?). There are a few of these in GR zip tied to top floor apartment balconies. 
## What is the topology like?
The meshtastic flood routing algo will hear a message, if it still has hops left it will wait for X*random amount of time, subtract 1 from the hop count, retransmit the message if it is not one of the `_Mute` roles. X is a constant that is different for most roles. Infrastucture nodes have a lower X, client nodes have a higher X.
### But I thought meshtastic used directed routing?
It does, but only for direct messages. It still uses flood routing for talking in channels.
### What are the "Black Holes" I hear people talking about?
A black hole is what happens when someone sets their node to a role with a lower X than they should causing other nodes who might be in a better position to repeat to no retransmit because they already heard a repeat.
### What are the common roles and when should I use them?
#### The client roles
These are what 99% of the nodes out there should be using.
- Client_Mute: If you are in a city/suburban environment, use this for any node that is going to be on your person or inside a car/truck/home. It does not repeat and will not create routing holes.
- Client_Base: This is the role you want to use on your home tower, on top of your house, or in most situations where you're in an sub 100ft HAAT location. This is a semi-infrastructure role
- Client: Use this in locations where you want the node to repeat, but after the infrastucture nodes have had time to transmit. Use this for your MQTT gateways and for mesh nodes mounted *outside* the car.
#### The infrastucture roles
These should only be used if you are at least 100ft [HAAT](https://recnet.com/haat). If using the calculator, put in your lat/long, put in your antenna height above ground level (it will get the elevation above sea level for you), and select the `Above Ground Level` radio button, then get HAAT. 
- Repeater: Use this if you have a great location (greater than 500ft HAAT), dont a screen, and need prioritized routing. These are AND statements, if one doesnt apply to you, dont use this role. This role will not show up in your node lists.
- Router_Late: Use this if you have an OK location (100-500ft HAAT), and need prioritized routing. These are AND statements, if one doesnt apply to you, dont use this role.



