---
sidebar_label: Common Services
---
# Services
What good is a network without services? MichMesh runs two ways to talk with more than one person at a time:

| | [Group Chat](#group-chat) | [Relay Chat (RRC)](#relay-chat-rrc) |
| --- | --- | --- |
| Feels like | A group text | IRC or Discord rooms |
| Client | Any LXMF messenger: Sideband, MeshChat, NomadNet, Reticulum Mobile App | An RRC client: NomadNet, Reticulum Mobile App |
| Rooms | One chat per service | Many rooms on one hub |
| Missed messages | Recent messages replayed when you join or rejoin | Room history replayed when you join; `@mentions` sent to your LXMF inbox while you're away |

Both run over whatever connects you to the mesh: LoRa, TCP, or both. See [Connect to the Reticulum Network](./01-Getting_Started.md) to get a client online first.

## Group Chat {#group-chat}

MichMesh's group chat runs [reticulum-group-chat](https://github.com/thatSFguy/reticulum-group-chat) (`fwdsvc`). It's an ordinary LXMF address that behaves like a chat room: anything a member sends to it is forwarded to every other member, tagged with the sender's nickname. There's nothing special to install. If you can send an LXMF message, you can use it.

### Join the MichMesh Group Chat {#join-group-chat}

1. In your LXMF client, start a conversation with the MichMesh group chat: `<MICHMESH_GROUP_CHAT_HASH>`
2. Send `/join`. You'll get a confirmation, followed by the most recent messages so you can catch up on the conversation.
3. Send `/nick <name>` to pick the name others see. Until you do, it uses your announced display name.
4. Say hi. Everything you send from now on goes to the whole group.

A first message sent without `/join` gets a reply explaining how to join; it isn't forwarded to anyone.

### Useful Commands {#group-chat-commands}

| Command | What it does |
| --- | --- |
| `/?` or `/help` | Lists the commands available to you |
| `/info` | What this group is, and how to get in |
| `/users` | Who's in the group |
| `/nick <name>` | Change your nickname (letters, digits, `_` and `-`, up to 24) |
| `/pins` | The group's pinned messages |
| `/pause` / `/resume` | Stop and restart receiving messages without leaving |
| `/textonly` / `/showall` | Skip attachments, for slow or metered links, and turn them back on |
| `/leave` | Leave the group; `/join` again any time |

Members who haven't been heard from in a few weeks are removed automatically. Just `/join` again.

## Relay Chat (RRC) {#relay-chat-rrc}

[Reticulum Relay Chat](https://rrc.kc1awv.net/) is IRC-style chat rooms over Reticulum. You connect to a **hub**, then join as many rooms as you like. MichMesh's hub runs [reticulum-relay-chat](https://github.com/thatSFguy/reticulum-relay-chat), which adds two things a standard RRC hub doesn't do:

- **History and playback.** The hub keeps a transcript of each room and replays recent messages when you join, so a room opens as a conversation already in progress, not a blank screen. Dropped off the mesh for a while? Reconnect and you're caught up. `/history` asks for more.
- **Mentions while you're away.** If someone writes `@yourname` while you're disconnected, the hub sends it to your regular LXMF inbox (Sideband, MeshChat, etc.) as a direct message. It comes from an address named `<hub name>(noreply)`, which only sends; reply in the room instead.

### RRC Clients {#rrc-clients}

- **[NomadNet](https://github.com/markqvist/NomadNet)** has a built-in RRC client, and opens `rrc://` room links directly.
- **[Reticulum Mobile App](https://github.com/thatSFguy/reticulum-mobile-app)** (Android and iOS) has a **Rooms** tab. RRC is experimental and off by default: turn it on in Settings, then add the hub by its hash or tap it in the Nodes list, where RRC hubs are labelled.

### Join the MichMesh Hub {#join-rrc}

1. In your RRC client, add the MichMesh hub: `<MICHMESH_RRC_HUB_HASH>`
2. Connect. You'll land in `#lobby`, with its recent history.
3. Send `/list` to see the other rooms, and `/join <room>` to enter one. You can also open a room link like `rrc://<MICHMESH_RRC_HUB_HASH>/lobby`.

Nicknames are first come, first served, and stay yours between visits. If someone already has the name you ask for, you'll get `name1` and a notice saying so.

:::tip Getting mentions in your inbox
Offline mentions go to the LXMF inbox of the **same identity** you used to connect to the hub. If your RRC client and your messaging app use different identities, mentions won't arrive. Send `/notify address` in the hub and compare the address it shows with your messaging app's own. `/notify test` sends a test notification.
:::

### Useful Commands {#rrc-commands}

| Command | What it does |
| --- | --- |
| `/help` | Lists the commands you can run, or explains one |
| `/list` | Rooms on this hub |
| `/who [room]` | Who's in a room |
| `/history` | More of the room's history |
| `/link [room]` | A link to a room you can paste anywhere |
| `/mentions` | Mentions the hub is holding for you |
| `/seen <nick>` | When someone was last around |
| `/away` / `/back` | Have mentions sent to your inbox even while you're connected, then turn that off |
| `/notify` | How the hub would reach you, and anything stopping it |
| `/whoami` | Who the hub thinks you are |

## Run Your Own

Both services are single static binaries with no runtime to install. They run on anything from a Raspberry Pi Zero to a Linux server, and releases include Windows builds. Each project's README walks through setup; the short version is below.

Whichever you run, **back up its identity file**. The identity *is* the service's address: lose it and everyone has to find you at a new hash.

### Group Chat {#host-group-chat}

1. Download `fwdsvc` for your platform from the [latest release](https://github.com/thatSFguy/reticulum-group-chat/releases/latest).
2. Start from the [example config](https://github.com/thatSFguy/reticulum-group-chat/blob/main/configs/fwdsvc.example.toml): set `display_name`, and point `[[interfaces]]` at a Reticulum node such as `rns.michmesh.net:7822` or your own `rnsd`.
3. Run it once. The log prints the **delivery destination**, the address you share with your group.
4. Message it from your LXMF client, copy your hash from its log into `admins`, and restart.

The README covers [running it under systemd](https://github.com/thatSFguy/reticulum-group-chat#linux--systemd-recommended), [invite-only groups](https://github.com/thatSFguy/reticulum-group-chat#private-invite-only-groups), [propagation-node delivery](https://github.com/thatSFguy/reticulum-group-chat#propagation) for offline members, and the full list of moderator commands.

### RRC Hub {#host-rrc-hub}

1. Download `rrc-hub` and `rrc-hub.example.toml` from the **same** [release](https://github.com/thatSFguy/reticulum-relay-chat/releases/latest); config keys change between versions.
2. Set the hub `name`, turn on `history_enabled` if you want playback (it's off by default, because it stores conversations on disk), and add a `tcp_client` interface pointing at a Reticulum node.
3. Run `./rrc-hub -config rrc-hub.toml`. The log prints the hash people add in their RRC client.

The [README](https://github.com/thatSFguy/reticulum-relay-chat#deploy-it) has a systemd unit and the operating notes. In particular, keep the `ping_interval` / `ping_timeout` keepalive on: it's how the hub knows someone has left, and mention notifications depend on it.

## Weather Bot
A bot that fetches the weather for your area, as well as grabbing live satellite images for your area.
1. `mkdir -p ~/src/ ; git clone https://github.com/DayleDrinkwater/LXMF-WX-Bot.git ~/src/LXMF-WX-Bot`
2. Edit `wxbot.py`, comment out/copy to a new line the `bot =` definition and add your own name. for example:
```
#bot = LXMFBot("Weather Bot - Send 'Help' for more info",announce=36000)
bot = LXMFBot("My Weather Bot - Send 'Help' for more info",announce=3600)
```
3. Create `/etc/systemd/system/wxbot.service` to more easily manage starting/stopping/auto-start the wxbot.
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

