---
sidebar_label: Common Services
---
# Services
What good is a network without services?
### Distribution Groups
If we want to chat with more than one person at a time, we need to setup a Distribution Group. To set up your own DG, do the following:
1. Clone the repo: `mkdir -p ~/src/ ; git clone https://github.com/SebastianObi/LXMF-Tools.git ~/src/LXMF-Tools`
2. Copy `LXMF-Tools/lxmf_distribution_group_extended/lxmf_distribution_group_extended.py` to your `reticulum/bin` dir with the name of your dg. `cp ~/src/LXMF-Tools/lxmf_distribution_group_extended/lxmf_distribution_group_extended.py ~/reticulum/bin/My_DG.py`
3. Make it executable. `chmod 755 ~/reticulum/bin/My_DG.py`
4. Run it once to create the needed config/itentities. `~/reticulum/bin/My_DG.py` - you may need to ctrl-c to stop it after it creates it's files.
5. Create an override config at `~/.config/My_DG/config.cfg.owr`, us this as a template:
```
[main]
lng = en # en/de
[lxmf]
display_name = My Distribution Group
propagation_node_auto = False
propagation_node = bb5920b34312ed57265dd173ec5171ad
[telemetry]
location_enabled = False
location_lat = 0
location_lon = 0
owner_enabled = False
owner_data = 
state_enabled = False
state_data = 0
[cluster]
enabled = False
name = grp
type = cluster
display_name = USA/Michigan
[router]
enabled = False
display_name = USA,USA/Michigan
[high_availability]
enabled = False
role = master
peer = 
[statistic]
enabled = False
```
6. Create `/etc/systemd/system/My_DG.service` to more easily manage starting/stoping/auto-start the DG.
```
[Unit]
Description=My LXMF Distribution Group
After=multi-user.target

[Service]
Type=simple
Restart=always
RestartSec=3
User=YOURUSERNAME
ExecStart=/home/YOURUSERNAME/reticulum/bin/python3 /home/YOURUSERNAME/reticulum/bin/My_DG.py

[Install]
WantedBy=multi-user.target

``` 
7. Start the service to make sure it's working. `sudo systemctl start My_DG.service`
- If there is an error in the service file, you will need to let systemd know when you've updated the .service file. You do this by running `sudo systemctl daemon-reload`
8. If the service is running, you can enable automatic startup by running `sudo systemctl enable My_DG`
9. Logs 
- If you want to see the dg logs, you can check them with `sudo journalctl -u My_DG` 
- if you want to follow thte logs, you can do that with `sudo journalctl -fu My_DG`
- If you want to trim all logs older than 1 week, you can run `sudo journalctl --vacuum-time=7d` to clean all logs older than 7 days, or `sudo journalctl --vacuum-time=7d -fu My_DG` the clear only the logs older than 7d for `My_DG`.

### Weather Bot
A bot that fetches the weather for your area, as well as grabbing live satellite images for your area.
1. `mkdir -p ~/src/ ; git clone https://github.com/DayleDrinkwater/LXMF-WX-Bot.git ~/src/LXMF-WX-Bot`
2. Edit `wxbot.py`, comment out/copy to a new line the `bot =` definition and add your own name. for example:
```
#bot = LXMFBot("Weather Bot - Send 'Help' for more info",announce=36000)
bot = LXMFBot("My Weather Bot - Send 'Help' for more info",announce=3600)
```
3. Create `/etc/systemd/system/wxbot.service` to more easily manage starting/stoping/auto-start the wxbot.
```
[Unit]
Description=LXMF WXbot
After=multi-user.target

[Service]
Type=simple
Restart=always
RestartSec=3
User=YOURUSERNAME
ExecStart=/home/YOURUSERNAME/reticulum/bin/python3 /home/YOURUSERNAME/src/LXMF-WX-Bot/wxbot.py

[Install]
WantedBy=multi-user.target
```

4. Start the service to make sure it's working. `sudo systemctl start wxbot.service`
- If there is an error in the service file, you will need to let systemd know when you've updated the .service file. You do this by running `sudo systemctl daemon-reload`
5. If the service is running, you can enable automatic startup by running `sudo systemctl enable wxbot`

