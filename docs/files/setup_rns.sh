#!/bin/bash

# check if venv already exists
if [[ -d ${HOME}/reticulum ]]; then
  read -p "Do you want to use the existing ${HOME}/reticulum? y|n: " use_existing_venv && use_existing_venv=`echo $use_existing_venv |tr '[:upper:]' '[:lower:]'|cut -c 1`
  if [[ "${use_existing_venv}" == "y" ]] ; then
    venv_path=${HOME}"/reticulum"
  else 
    read -p "enter the existing venv path: " venv_path
  fi
else  
  read -p "Do you want to create a venv under ~/reticulum? y|n: " create_new_venv && create_new_venv=`echo $create_new_venv |tr '[:upper:]' '[:lower:]'|cut -c 1`
  if [[ "${create_new_venv}" == "y" ]] || [[ "${use_existing_venv}" == "y" ]] ; then
    venv_path=${HOME}"/reticulum"
  else
    read -p "Please supply path for new venv. This script expects to run in a venv.: " venv_path
  fi
fi
## create the venv or bail
if [[ "_${venv_path}" != "_" ]] ; then ###&& [[ $use_existing_venv != "y" ]] ; then
    python -m venv $venv_path
    if [[ $? -ne 0 ]] ; then 
      echo "unable to create venv"
      exit 1
    fi
else
  if [[ "${use_existing_venv}" == "n" ]] ; then
    echo "this script expects to run in a venv. exiting"
    exit 2
  fi
fi

. ${venv_path}/bin/activate

cd ~/ 

## figure out what we need to install/upgrade
pip_install_list=""
read -p "Do you want to install/upgrade rnsd? y|n: " install_rns  && install_rns=`echo $install_rns |tr '[:upper:]' '[:lower:]'|cut -c 1`
if [[ $install_rns == "y" ]]; then 
  pip_install_list=rns
else
  rnsd --help >/dev/null || (echo "rnsd is not in your path" ; exit 3)
fi
read -p "Do you want to install/upgrade lxmd? y|n: " install_lxmd  && install_lxmd=`echo $install_rns |tr '[:upper:]' '[:lower:]'|cut -c 1`
if [[ $install_lxmd == "y" ]]; then 
  pip_install_list="${pip_install_list} lxmf"
fi
read -p "Do you want to install/upgrade nomadnet? y|n: " install_lxmd  && install_lxmd=`echo $install_rns |tr '[:upper:]' '[:lower:]'|cut -c 1`
if [[ $install_nomadnet == "y" ]]; then 
  pip_install_list="${pip_install_list} nomadnet"
fi

## install what needs be installed
if [[ "_${pip_install_list}" == "_" ]]; then
  echo "not installing anything"
else
  pip install -U ${pip_install_list}
fi

## create reticulum config if needed
if [[ ! -f ~/.reticulum/config ]] ; then
  timeout 10 rnsd
fi

## configure it
read -p "Do you want to configure reticulum? y|n:  " configure_reticulum && configure_reticulum=`echo $configure_reticulum |tr '[:upper:]' '[:lower:]'|cut -c 1`
if [[ $configure_reticulum == "y" ]] ; then
  ### enable transport
  read -p "Enable transport to move messages across multiple interfaces? y|n: " enable_transport && enable_transport=`echo $enable_transport |tr '[:upper:]' '[:lower:]'|cut -c 1`
  test $enable_transport == "y" && sed -i 's/enable_transport \= False/enable_transport = True/' .reticulum/config
  ### enable ipv4 backbone for internet linking
  read -p "Enable ipv4 Backbone Interface? y|n: " enable_v4backbone && enable_v4backbone=`echo $enable_v4backbone |tr '[:upper:]' '[:lower:]'|cut -c 1`
  if [[ "${enable_v4backbone}" == "y" ]] ; then 
    interfaces=`ip link show | grep '^[0-9]' | awk '{print $2}' | tr -d ":" | tr "
" " "`
    read -p "What interface to use? ${interfaces}: " which_interface
    cat << EOF >> ~/.reticulum/config
  [[My ipv4 backbone]]
    mode = gateway
    type = BackboneInterface
    interface_enabled = True
    device = ${which_interface}
    listen_port = 7822
  
EOF
  fi

  read -p "Enable ipv6 Backbone Interface? y|n: " enable_v6backbone && enable_v6backbone=`echo $enable_v6backbone |tr '[:upper:]' '[:lower:]'|cut -c 1`
  if [[ "${enable_v6backbone}" == "y" ]]; then
    interfaces=`ip link show | grep '^[0-9]' | awk '{print $2}' | tr -d ":" | tr "
" " "`
    read -p "What interface to use? ${interfaces}: " which_interface
 cat << EOF >> ~/.reticulum/config
  [[My ipv6 backbone]]
    mode = gateway
    type = BackboneInterface
    interface_enabled = True
    device = ${which_interface}
    listen_port = 7822
    prefer_ipv6 = True
  
EOF
  fi

  read -p "Enable MichMesh Interface? y|n: " enable_michmesh && enable_michmesh=`echo $enable_michmesh |tr '[:upper:]' '[:lower:]'|cut -c 1`
  if [[ "$enable_michmesh" == "y" ]] ; then
    cat << EOF >> ~/.reticulum/config
  [[michmesh TCP]]
    type = TCPClientInterface
    interface_enabled = true
    target_host = rns.michmesh.net
    target_port = 7822
    name = michmesh TCP
    selected_interface_mode = 1
    configured_bitrate = None

EOF
  fi

  read -p "Enable custom client interface? y|n: " enable_custom && enable_custom=`echo $enable_custom |tr '[:upper:]' '[:lower:]'|cut -c 1`
  while [[ "${enable_custom}" == "y" ]]; do 
    read -p "target host" custom_target_host
    read -p "target port" custom_target_port
    cat << EOF >> ~/.reticulum/config
  [[${custom_target_host} TCP]]
    type = TCPClientInterface
    interface_enabled = true
    target_host = ${custom_target_host}
    target_port = ${custom_target_port}
    name = michmesh TCP
    selected_interface_mode = 1
    configured_bitrate = None

EOF
    read -p "Enable another custom client interface? y|n: " enable_custom && enable_custom=`echo $enable_custom |tr '[:upper:]' '[:lower:]'|cut -c 1`
  done
fi ## configure reticulum

## configure lxmd
read -p "Do you want to configure lxmd? y|n:  " configure_lxmd && configure_lxmd=`echo $configure_lxmd |tr '[:upper:]' '[:lower:]'|cut -c 1`

if [[ "$configure_lxmd" == "y" ]] ; then 
  if [[ ! -d ~/.lxmd/config ]] ; then 
    timeout 10 lxmd
  fi
  read -p "Do you want to be a propagation node? y|n:  " lxmd_prop && lxmd_prop=`echo $lxmd_prop |tr '[:upper:]' '[:lower:]'|cut -c 1`
  if [[ "${lxmd_prop}" == "y" ]] ; then
    sed -i "s/enable_node \= no/enable_node = yes/" ~/.lxmd/config
  fi
  read -p "lxmd node name. blank becomes random string: " lxmd_node_name 
  if [[ "_${lxmd_node_name}" == "_" ]]; then
    lxmd_node_name=`mktemp -u XXXXXXXXXX`
  fi
  
  sed -i "s/\# node_name \= Anonymous Propagation Node/ node_name = ${lxmd_node_name}/" .lxmd/config 
  sed -i "s/display_name = Anonymous Peer/ display_name = ${lxmd_node_name}/" .lxmd/config 
fi ### configure lxmd


## setup systemd services

read -p "Do you want to configure rns as a service? y|n:  " rns_service && rns_service=`echo $rns_service |tr '[:upper:]' '[:lower:]'|cut -c 1`
if [[ "${rns_service}" == "y" ]] ; then
  rns_user=`whoami` 
  cat <<EOF> /tmp/rnsd.service
[Unit]
Description=Reticulum Network Stack Daemon
After=multi-user.target

[Service]
Type=simple
Restart=always
RestartSec=3
User=$rns_user
ExecStart=/home/$rns_user/reticulum/bin/python /home/$rns_user/reticulum/bin/rnsd --service

[Install]
WantedBy=lxmd.service
EOF

  sudo cp /tmp/rnsd.service /etc/systemd/system/
fi

read -p "Do you want to configure lxmd as a service? y|n:  " lxmf_service && lxmf_service=`echo $lxmf_service |tr '[:upper:]' '[:lower:]'|cut -c 1`
if [[ "${lxmf_service}" == "y" ]] ; then
  rns_user=`whoami` 
  cat <<EOF> /tmp/lxmd.service
[Unit]
Description=Reticulum lxmd
After=multi-user.target
Requires=rnsd.service
After=rnsd.service

[Service]
Type=simple
Restart=always
RestartSec=3
User=${rns_user}
ExecStart=/home/${rns_user}/reticulum/bin/python3 /home/${rns_user}/reticulum/bin/lxmd --propagation-node

EOF
  sudo cp /tmp/lxmd.service /etc/systemd/system/

fi

if [[ "${rns_service}" == "y" ]] || [[ "${lxmf_service}" == "y" ]]; then
  sudo systemctl daemon-reload
fi

if [[ "${rns_service}" == "y" ]] ; then
  sudo systemctl enable rnsd
  sudo systemctl start rnsd
fi

if [[ "${rns_service}" == "y" ]] ; then
  sudo systemctl enable lxmd
  sudo systemctl start lxmd
fi

sleep 3 rnstatus && echo "

Looks good!" 

read -p "Would you like to setup an RNode? y/n" setupRnode && echo setupRnode=`echo $setupRnode |tr '[:upper:]' '[:lower:]'|cut -c 1`
if [[ "${setupRnode}" == "y" ]] ; then
  rnodeconf --autoinstall
  echo Finish the interface config with help from https://michme.sh/docs/Reticulum/RNode 
fi
