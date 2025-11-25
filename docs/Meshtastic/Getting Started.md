## Wait a minute, this is confusing!
Yeah, there are some terms that get used differently depending on where they are used. Freq channels are also called channel slots or just channels, but general chat channels are also called channels? Yeah, it's a mess. Organic growth in the app and documentation have made things confusing. Dont worry about asking questions if you are unsure - we all had to figure it out and most of us are pretty friendly about answering questions.

## Do I need to change frequency/channel number in order to connect with other people?
Most likely, no. The standard `LongFast` channel preset will cover your area. Some people are playing with using faster (shorter range) and slower (longer range) channels, but this is usually coordinated and not used long term.

## MQTT
If you dont already have an MQTT gateway on your mesh or if you are a mobile node, you may want to setup an MQTT gateway.
You likely do *not* want to use the `msh/US` topic, so let's setup the `msh/US/MI` topic. 

### To Join the Michigan Meshtastic MQTT Topic

1. iOS: Go to >config>Module configuration - Android: ☰ > Radio Configuration
2. go to LoRa, enable `Ok to MQTT`, click `Send`
3. Click `MQTT`
4. Enable `MQTT`
* If you want to use the MichMesh MQTT server (which is connected to the public Meshtastic MQTT server), change the server name to `mqtt.michmesh.net`. The username/password are the same - `meshdev`/`large4cats`
5. Scroll to root Topic
6. Paste `msh/US/MI`
7. Enable Proxy to Client - skip this step if you're using a network connected node like and ESP32 on WiFi or a POE powered WisBlock (This adds a internet connection to the node if you have only Bluetooth connection and not wifi.)
8. Click save
The node will now reboot. 

### Once it's up, it's time to enable uplink/downlink on your channels.

1. iOS: Go to >config>channels - Android: ☰ > Radio Configuration > channels
2. Click Primary/Default/LongFast Channel
3. Enable Uplink (if you want to show up on the maps) 
4. Enable Position if you want to send your location out over the mesh.
5. click Save

### Adding the extra channels
> Michigan
1. iOS: Go to >config>channels - Android: ☰ > Radio Configuration > channels
2. Click `+`
3. Channel Name: `Michigan`
4. iOS: Key Size: `8 bit`
5. PSK: `MA==` - this is case sensitive, it *must* be uppercase and without spaces.
6. Enable Uplink/Downlink 
7. Enable Position if you want to send your location out over the mesh.
8. click save

> Western Michigan
1. iOS: Go to >config>channels - Android: ☰ > Radio Configuration > channels
2. Click `+`
3. Channel Name: `WMI`
4. iOS: Key Size: `8 bit`
5. PSK: `MA==` - this is case sensitive, it *must* be uppercase and without spaces.
6. Enable Uplink/Downlink 
7. Enable Position if you want to send your location out over the mesh.
8. click save

> Eastern Michigan
1. iOS: Go to >config>channels - Android: ☰ > Radio Configuration > channels
2. Click `+`
3. Channel Name: `EMI`
4. iOS: Key Size: `8 bit`
5. PSK: `MA==` - this is case sensitive, it *must* be uppercase and without spaces.
6. Enable Uplink/Downlink 
7. Enable Position if you want to send your location out over the mesh.
8. click save

> Muskegon
1. iOS: Go to >config>channels - Android: ☰ > Radio Configuration > channels
2. Click `+`
3. Channel Name: `Muskegon`
4. iOS: Key Size: `8 bit`
5. PSK: `MA==` - this is case sensitive, it *must* be uppercase and without spaces.
6. Enable Uplink/Downlink 
7. Enable Position if you want to send your location out over the mesh.
8. click save

> Northern LP
1. iOS: Go to >config>channels - Android: ☰ > Radio Configuration > channels
2. Click `+`
3. Channel Name: `NMI`
4. iOS: Key Size: `8 bit`
5. PSK: `MA==` - this is case sensitive, it *must* be uppercase and without spaces.
6. Enable Uplink/Downlink 
7. Enable Position if you want to send your location out over the mesh.
8. click save

> Upper Peninsula 
1. iOS: Go to >config>channels - Android: ☰ > Radio Configuration > channels
2. Click `+`
3. Channel Name: `YOOPER`
4. iOS: Key Size: `8 bit`
5. PSK: `MA==` - this is case sensitive, it *must* be uppercase and without spaces.
6. Enable Uplink/Downlink 
7. Enable Position if you want to send your location out over the mesh.
8. click save

#### After channel config
click `Send` to push new channels to node.


