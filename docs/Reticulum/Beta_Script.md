---
sidebar_label: Beta Script
---


# Beta Script
[Here is a test script](https://raw.githubusercontent.com/MichMesh/docusaurus/refs/heads/master/docs/files/setup_rns.sh) for installing and configuring RNS. It is still very beta. 
## How to use it.
1. Download the file using wget and the link above `wget PASTEDLINK`
2. Make the file executable `chmod +x setup_rns.sh`
3. Run it. It will ask the following questions:
- Do you want to create a new python venv or use an existing. Unless you are really tight on space, create a new one - it will use less than $50mb.
- Which services to you want to install. 
- RNS is the base for everything else. If it is already installed, choose `n`, otherwise `y`.
- LXMD is the propagation server - this is what stores messages for later pickup when you are not around.
- NomadNet is a text based interface as well as a web server equiv.
- It will now ask if you want to setup Reticulum.
- It will then ask if you want to enable transport mode. If enabled, this will act like a router or gateway between interfaces.
- It will then ask if you want to enable an ipv4 backbone interface - this is what you would want if you are going to host an external server like rns.michmesh.net. If you do this, it will ask which interface you want to attach to.
- It will then ask if you want to enable an ipv6 backbone. same as above.
- It will then ask if you want to create the MichMesh interface. This is a connection to the regional test net.
- It will then ask if you want to create your own tcp client to connect to another network. You will need to know the hostname or IP and port.
- It will then ask if you want to configure LXMD - the propagation server from above.
- It will then start the service to create the config and identity files. There will be a few errors here, they can usually be ignored.
- It will then ask if you want to be a propagation node. If so, it will then ask what you want to name your node. 
- It will then ask if you want to enable RNS and LXMD systemctl.services. This will auto-start the services on boot.
- It will then ask if you want to deploy an RNode. If so, plug in a compatible device and hit enter. After that you will need to manually setup your config using [our rnode config page](RNode) or [the reticulum interface page](https://reticulum.network/manual/interfaces.html#rnode-lora-interface) 
