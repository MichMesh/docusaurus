---
sidebar_label: MN-101: Introduction to Mesh Networking
---

## _"What is a 'mesh network'?"_
Let's get visual!

You're probably already familiar with how the Web (or, what most of us call, "the Internet") works. Aside from some exceptions, it's built using a 'hub and spoke' or 'star' model—a network which resembles a bike wheel. At the center there is a 'hub' (or 'server') with 'spokes' (or 'clients') branching off around it in a circle. This model requires the 'spokes' to first communicate with the 'hub' to connect with another 'client'. This means the 'hub' (server) has the power to decide every connection.

A mesh network (sometimes referred to as 'point-to-point communication'), by contrast, is one which there is no 'hub' meaning every 'spoke' (or, in our case, 'node') can freely communicate with every other one, with no one making decisions for anyone else. They're not beholden to or at the mercy of corporations or governments, making them resistant to censorship campaigns and laws which seem to change by the day these days, and totally unencumbered by subscriptions, contracts, leases, rental, and fees.

Unlike the situation where the hub goes down and everything goes down with it—the ever-more common outages of servers like Amazon Web Services (AWS) knocking Netflix out or Spectrum cutting you off from your Signal / Delta Chat group chats—a mesh network is also _self-healing_, meaning if a node goes down or moves, the network dynamically adapts to ensure communications continue. This is what makes it resilient (and the ideal network style) in situations like natural disasters when cell towers fail.

Mesh networks exist on a spectrum of functionality, simplicity, and privacy, security, and anonymity. It's crucial to take these factors into consideration when deiciding which to use for your specific situation or needs.

## _"What is a node?"_
In abstract network terms, a node is an entity that can receive and transmit traffic like data. We can think about it sort of like a subway station with trains passing in and out.

In practical terms, it's the physical device known as a [transceiver] that provides the radio hardware to connect your smartphone to the other people on the network. Some nodes even sport screens & keyboards so they can operate independently of your smart phone.

Regardless of the mesh network your using, each node has a role. Sticking with the subway station metaphor from earlier, most nodes are regular stations or 'endpoint devices' from which traffic comes and goes. These are the nodes you'd carry with you in your pocket, clipped to your bag, or magnetically-attached to your smart phone. There are also nodes which act as transfer stations where the traffic can pass from one line to another and ones which act as the big terminals which route lots of traffic between several lines. These two types of nodes are typically stationary, and hang out on a rooftop (in the case of the former) or a tower or mountaintop even (in the case of the latter) to help connect distant nodes or distinct clusters of nodes (think two towns divided by a mountain range). [More about node roles.]

## The Electromagnetic Spectrum
Every car stereo with FM/AM, microwave oven, pair of AirPods, and flash light uses a portion of the electromagnetic spectrum. When you break a leg, we use X-Rays to visualize what's going on in your leg. When you reheat your coffee (even though you know you shouldn't) in the microwave oven, you're using microwaves. And when we listen to music on Bluetooth headphones or send messages on Signal or over the mesh net from our nodes, we're using radio waves.

Each of these types of rays and waves are defined by a range of frequencies. (We don't need to get into the nitty gritty of gamma rays and whatnot, so we'll only concentrate on radio waves here.) Within the range of frequencies for radio waves, governing bodies—both national and international, and regardless to whether or not we agree with or consent to them—have defined distinct 'bands' and designated each for specific purposes.

For the mesh networks we'll be deploying, most nodes will utilize a communication method known as [LoRa], or _Long Range_ radio, that uses specific bands of the radio spectrum, similar to Wi-Fi, Bluetooth, and 4G cellular radios, known as [ISM radio bands].

## ISM Radio Bands; LoRa, and Other Methods
ISM (or "industrial, scientific and medical", though that's an antiquated definition), radio bands are used by everything from Wi-Fi routers to the walkie talkie we played with as kids. Within this band is _yet another_ set of distinct sections. For our purposes, here in the so-called United States / Canada, we'll be using the section known as '915MHz', which doesn't require a license to broadcast on or communicate over.

LoRa is a _proprietary_ (a.k.a. _not_ open source) technology which transmits data in a very specific manner that's well suited for communicating with low-power transceievers.

Nodes aren't limited to proprietary LoRa technology, though, as some can use variations of the open standard Wi-Fi called _HaLow_ (802.11ah), DASH7 (which operates on 433 MHz, 868 MHz, and 915 MHz frequencies), and just about anything else your imagination can concoct (laser beams between buildings, QR codes, and on and on)!

## _"How do I get started?"_
Spend some time thinking about some of the reasons you might want to use a mesh network: Is it for being ready with a backup communication method during a crisis (weather-related or not)? Is it to shoot the breeze with friends, family, and partner(s) knowing you aren't exposing yourself to the ills of the surveillance capitalism apparatus? (Remember when saying that sounded paranoid and extremely 'tin-foil hat'?) Is it to stay connected while hiking or avoid censorship for political organizing or during street actions like protests? All of the above?

## _"Do I need to build my own network from scratch?"_
It's likely people and organizations have already spearheaded building out the network, so the only thing you'll have to do is join in and spread the word!

Read on about the different networks we've actively been deploying and connecting!



