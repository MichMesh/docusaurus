---
sidebar_label: Regions and Scoping
---

# Regions and Scoping

:::info Now: step 1, tagging every repeater
Michigan is rolling out regions in steps, and step 1 is giving every repeater its region names. Until the next step is announced, your messages travel just as they always have.

- **Companion users:** nothing you need to set. Unscoped messages reach everyone. You're welcome to experiment with scoped messages; they only reach as far as repeaters carry their region, so expect gaps while repeaters are still being tagged.
- **Repeater operators:** define your regions with `region def` and `region save`, and change no other region or scope settings. [Repeater Setup](./03-Repeater-Setup.md#regions-on-hold) has the details.

Messages not getting through? Clear your scope: [companions](./01-Getting-Started.md#undo-region-scoping), [repeaters](./03-Repeater-Setup.md#undo-scoping). [The Rollout](#the-plan) has what's next.
:::

## How Regions Work {#how-regions-work}

Four words do all the work:

- **Region**: a name for an area, like `mi` (Michigan), `mi-central` (Flint, Lansing, the Tri-Cities) or `azo` (Kalamazoo).
- **Carry**: the regions a repeater has defined are the ones it *carries*. "Tagging" a repeater means defining its regions. Repeaters are tagged; messages are scoped.
- **Scoped**: a message sent with one region attached. The region on a message is its **scope**. In the MeshCore app that's your *Default Region Scope* and each channel's *Region Scope*; other apps label them differently.
- **Unscoped**: a message with no region attached. That's what you send when those settings are blank, and nearly everything in Michigan today.

What happens to a message depends on whether it has a scope, and on which [step of the rollout](#the-plan) Michigan is in:

| | Today | Once unscoped messages are limited (step 2) |
| --- | --- | --- |
| **Unscoped message** (no region) | Every repeater passes it on | Repeaters pass it on about 3 times, then it stops |
| **Scoped message** (one region, like `mi`) | Only repeaters that carry its region pass it on | Same: only repeaters that carry its region, as far as they reach |

Tagging a repeater never costs an unscoped message anything; regions only decide which scoped messages get through. [Step 2: What Changes](#when-limited) has more on the limit.

**The tree is for us, not the radios.** Michigan's regions form a tree: `midwest` › `mi` › one of five subregions (`mi-west`, `mi-central`, `mi-east`, `mi-north`, `mi-upper`) › sometimes a local region like `azo`. It helps people pick names that fit together. The radios don't use it to decide what to pass on: a repeater with `mi-east` won't pass a message scoped to `mi` unless it has `mi` too. So each repeater is given every level, from `midwest` down to its own area.

Three more things worth knowing:

- **A scope only changes what repeaters pass on.** Your radio still hears everything that reaches it.
- **A scope isn't privacy.** Your channel key is what keeps a message private.
- **One gap stops a scoped message.** Every repeater that doesn't carry its region drops it, so a scoped message only gets as far as an unbroken line of repeaters that carry it. That's why every repeater gets tagged before scoped messages become the norm.

## Why Scoping Matters {#why}

**What this is really about.** MeshCore is growing fast, and in parts of Europe, meshes that filled in with no scoping got so busy that the local mesh stopped working for the people under it. Detroit, Flint, Lansing, the Tri-Cities, Kalamazoo and Grand Rapids all have repeaters on the air, and as those networks fill in they grow into each other. The goal is to keep the mesh usable for people in their own area by default, and make reaching far-away areas a deliberate choice.

**Where it showed up first.** West-side repeaters regularly hear traffic from Chicago, carried across Lake Michigan on days when signals travel unusually far. We hear them but they can't hear us, so it's just noise here, and every repeater that hears it repeats it. Michigan borders Ohio, Indiana, Wisconsin and Ontario too, and the same can happen along any of those edges as meshes there grow.

**Why regions alone don't fix it.** That traffic is unscoped, and every repeater passes unscoped messages. Regions only help once there's also a decision about unscoped traffic.

**Why we don't just block it.** Every new user starts out unscoped. Blocking unscoped messages would silence them until they set a scope they don't know exists yet. That's the wrong trade for a network that wants to grow.

**What other meshes learned.** Where some repeaters were tagged and others weren't, scoped messages got lost in the gaps, and several cities in Poland gave up on scoping for that reason. Some communities tag every repeater before anyone scopes, which is what Michigan is doing.

## Why the Names Look Like This {#why-the-names}

**Each step down the tree is a smaller area.** Once tagging is done, every Michigan repeater carries `midwest` and `mi`, but only repeaters around Detroit, Ann Arbor and Port Huron carry `mi-east`, only Upper Peninsula repeaters carry `mi-upper`, and only repeaters around Kalamazoo carry `azo`. So the smaller the region, the fewer repeaters pass the message on and the shorter it spreads:

| Scoped to | Passed on by, once tagged | Reaches |
| --- | --- | --- |
| `midwest` | Every Michigan repeater, and neighbors' repeaters that carry it | Across state lines |
| `mi` | Every Michigan repeater | The whole state |
| A subregion: `mi-west`, `mi-central`, `mi-east`, `mi-north`, `mi-upper` | Repeaters in that part of the state | That part of Michigan |
| A local region, like `grr` (Grand Rapids) or `azo` (Kalamazoo) | Repeaters serving that area | That metro area |

When scoping starts, the idea is to pick the smallest region that still reaches the people you're talking to.

**Why `mi-west` and not just `west`.** A region name means the same thing everywhere. If Michigan's subregions were plain `west`, `east` or `north`, our repeaters would pass messages scoped to those names from any mesh that used them, whether across Lake Michigan, in Ohio or Ontario, or across the UP's border with Wisconsin, and our messages would ride their repeaters too. The `mi-` prefix makes Michigan's subregions Michigan's alone. Local names need the same care, so check a new one against Michigan's [region naming plan](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning) (RFC-001) and with nearby operators before using it.

**Why `midwest` sits on top.** Some messages are meant to cross state lines. Giving them their own scope, coordinated with neighboring meshes, keeps that traffic from riding `mi` or going out unscoped.

## Where Michigan Stands {#where-we-are}

**Every Michigan repeater should be tagged now**, with `midwest`, `mi`, its subregion, and a local region if its area uses one. Regions follow the coverage a repeater actually serves, not a county line. Repeaters change no other region settings. Companions stay unscoped by default, and anyone can experiment with scoped messages.

Repeaters need firmware **1.16 or later**. For repeaters and companions alike, the latest release is best. Update from the [web flasher](https://flasher.meshcore.io/).

## What To Do Now {#what-to-do-now}

### Companion Users {#companion-users}

Nothing you need to set: with no scope, your messages are unscoped and reach everyone.

Want to try scoped messages? Go ahead. It's easiest on a channel: give it a scope like `mi` or your subregion, and keep your default scope blank so your adverts and direct messages still reach everyone. A scoped message only reaches as far as repeaters carry its region, so some won't arrive until every repeater is tagged. If messages stop getting through, or you joined a channel from a QR code or link that brought a scope with it, here's how to [clear it](./01-Getting-Started.md#undo-region-scoping).

You don't need to save region names in your app yet. If you do, follow [Getting Started](./01-Getting-Started.md#add-regions-to-app) exactly: in the MeshCore app, tapping a region in that list makes it your default.

### Repeater Operators {#repeater-operators}

Give your repeater `midwest`, `mi`, your subregion and, if your area uses one, your local region, then save:

```bash
region def midwest mi <subregion> <local_region>
region save
```

| Part of the state | Regions to carry |
| --- | --- |
| West Michigan | `midwest mi mi-west` |
| Central Michigan | `midwest mi mi-central` |
| Southeast Michigan | `midwest mi mi-east` |
| Northern Lower Peninsula | `midwest mi mi-north` |
| Upper Peninsula | `midwest mi mi-upper` |

If your area uses a local region, add it to the end, e.g. `midwest mi mi-west azo`. If you're not sure, check with operators near you. [Pick Your Regions](./03-Repeater-Setup.md#pick-your-regions) has every county, and [Verify](./03-Repeater-Setup.md#step-10-verify) shows how to check your work.

## FAQ {#faq}

### For Companion Users {#faq-companions}

<details>
<summary>What should I set on my phone right now?</summary>

Nothing is required. Unscoped messages reach everyone. Experimenting with a scoped channel is fine; keep your default scope blank so your adverts and direct messages aren't affected. [Getting Started](./01-Getting-Started.md#undo-region-scoping) shows how to clear a scope in each app.

</details>

<details>
<summary>Wouldn't setting `mi` keep my messages in Michigan, or help them reach farther?</summary>

Not yet. Today it mostly costs reach: not every Michigan repeater carries `mi` yet, and any that doesn't will drop your message, while every repeater passes unscoped messages. It's fine to try, just expect some messages not to arrive until tagging is done.

</details>

<details>
<summary>What will change for me when unscoped messages are limited?</summary>

Nothing yet. When step 2 starts, messages with no scope only reach people within about three repeaters, so you'll set a default scope to keep reaching the rest of the state. It'll be announced first, with the settings to make; [Step 2: What Changes](#when-limited) has the details.

</details>

<details>
<summary>If I set a scope, will I stop seeing messages from other areas?</summary>

No. A scope only affects what you send. Your radio still hears everything that reaches it.

</details>

<details>
<summary>Does scoping make my channel private?</summary>

No. A scope only limits which repeaters pass a message on. Only your channel key keeps a message private.

</details>

<details>
<summary>Is a channel named `#michigan` automatically scoped to `mi`?</summary>

No. A channel's name and its scope are separate settings. A channel shared by QR code or link can bring a scope with it, though, so check the channel's scope after you join one so you know what you're sending with.

</details>

### For Repeater Operators {#faq-repeaters}

<details>
<summary>Why tag repeaters now?</summary>

Defining regions only adds: your repeater can now pass scoped messages for those regions, and unscoped messages work exactly as before. Tagging every repeater now means that as scoped messages become common, nobody gets cut off.

</details>

<details>
<summary>Why does my repeater carry three or four regions instead of one?</summary>

Each level is a different reach a sender can pick: a local region for the metro area, a subregion for your part of the state, `mi` for statewide, `midwest` for across state lines. A repeater missing a level is a dead end for messages scoped to it. Most repeaters carry three (`midwest mi mi-east`), or four where their area uses a local region (`midwest mi mi-west azo`).

</details>

<details>
<summary>Will defining regions stop out-of-state traffic, like what crosses Lake Michigan from Chicago?</summary>

No. That traffic is unscoped, and regions only affect scoped messages. Limiting unscoped traffic is [step 2](#when-limited) of the rollout.

</details>

<details>
<summary>What should the `region` output look like?</summary>

It should list `midwest`, `mi`, your subregion and any local region, and every line, including the top one, should end in `F`. Repeater Setup's [Check Regions](./03-Repeater-Setup.md#audit-regions) has an example.

</details>

<details>
<summary>Should I copy the whole tree onto my repeater?</summary>

No. Carry exactly your own regions. Every extra region lets your repeater pass messages scoped to it from anywhere, and carrying a second subregion makes your site a [bridge](./03-Repeater-Setup.md#region-boundary), which is a group decision.

</details>

<details>
<summary>My regions disappeared after a reboot. What happened?</summary>

`region def` takes effect right away but isn't kept unless you run `region save`. On firmware 1.16, a save can fail and still answer `OK`, so update to the latest release. Also check the spelling: region names are exact, so `Mi` or `mi-wset` is a different region nobody else carries.

</details>

<details>
<summary>Discover Regions doesn't show my repeater. Why?</summary>

Discover Regions only asks repeaters your radio hears directly, and each repeater answers only a few requests every few minutes, so wait and try again. Use the steps in [Add Regions to Your App](./01-Getting-Started.md#add-regions-to-app) so you don't set a default scope by accident.

</details>

<details>
<summary>Will any of this change?</summary>

MeshCore is still adding region features, so details may change. This page gets rechecked before each step of the rollout. Follow the [MeshCore blog](https://blog.meshcore.io/) for what's new.

</details>

## The Rollout {#the-plan}

Michigan is rolling regions out in steps. Each one starts when operators agree the last one is done, and it's announced before it starts.

1. **Tag every repeater** (now). Every repeater carries all its regions, so nobody gets cut off when scoped messages start.
2. **Limit how far unscoped messages travel** (next). Companions set a default scope, and every repeater stops passing an unscoped message after it has been repeated 3 times, starting with tall, well-connected sites. Sparse areas, like much of the northern Lower Peninsula and the UP, can leave the limit off until coverage fills in. [What changes](#when-limited) is below.
3. **Stop passing unscoped messages** (later, optional). Only once most companions in an area have a default scope, and only coordinated with neighboring repeaters.

The steps follow [RFC-001 Addendum A](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning/blob/main/rfc/0001-addendum-a-scoping-and-county-reference.md), Michigan's draft scoping policy, with one change: repeaters don't set a `region default`. Where the two differ, follow this page.

### Step 2: What Changes {#when-limited}

When step 2 starts, an unscoped message only travels about three repeaters from where it started. Scoped messages aren't limited.

**If your companion has no scope set:**

- Your messages and adverts still reach people near you, within about three repeaters.
- People farther away won't get your channel messages or see you show up in their contacts, and a first message to someone far away won't reach them.
- Messages to people you've already reached usually follow a saved route, and those aren't affected.

**If you've set a default scope of `mi`** and the channel scopes below:

- Your messages travel as far as repeaters carry their scope: the whole state for `mi`, your part of the state for a subregion.
- One catch: delivery confirmations come back with the *other person's* scope. If they haven't set one, a message to someone far away can arrive but show as failed on your end.

**For everyone:**

- Out-of-state noise, like the traffic from Chicago, dies out within a few repeaters instead of crossing the state.
- In sparse areas where the nearest people are more than three repeaters away, operators may leave the limit off.
- Operators will announce it before it starts, along with the companion settings to make.

**Companion settings for step 2.** These become the recommendation when step 2 is announced; you can try them sooner, knowing some messages won't arrive until every repeater is tagged. A default scope of `mi`, plus channel scopes:

| Channel | Scope |
| --- | --- |
| Statewide, like `#michigan` | `mi` |
| Regional, like `#wmi` | that subregion, e.g. `mi-west` |
| Local, like `#grr` or `#azo` | that local region |
| Public | your local region, or your subregion if your area doesn't have one |

MeshCore's own guidance suggests setting a broad default scope right away. Michigan recommends it from step 2, so nobody gets cut off while repeaters are still being tagged.

## The Map and Names {#the-map}

Reference boundaries for the five subregions, drawn from county groupings. They're reference assignments, not borders: a repeater carries the region of the coverage it actually serves. Local regions follow observed coverage and aren't drawn.

<iframe
  src="https://optimetrics.github.io/mesh-region-map/"
  title="Michigan MeshCore region map"
  style={{width: '100%', height: '560px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}
  loading="lazy"
></iframe>

[Open the map full screen](https://optimetrics.github.io/mesh-region-map/) · [Map source and data](https://github.com/Optimetrics/mesh-region-map)

Michigan follows the draft [RFC-001: Michigan MeshCore Regions](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning), a proposal written by Michigan operators:

```text
midwest
├── mi
│   ├── mi-west
│   │   ├── grr        Grand Rapids
│   │   ├── mkg        Muskegon (example only)
│   │   └── azo        Kalamazoo
│   ├── mi-central
│   │   ├── thumb      (not settled)
│   │   └── midstate   (not settled)
│   ├── mi-east
│   │   └── det        Detroit (example only)
│   ├── mi-north       Northern Lower Peninsula
│   │   └── tvc        Traverse City (example only)
│   └── mi-upper       Upper Peninsula
│       └── mqt        Marquette (example only)
├── il                 Illinois (example only)
├── wi                 Wisconsin (example only)
└── in                 Indiana (example only)
```

**Carry only your own regions, not the whole tree.** `grr` and `azo` are the local regions RFC-001 defines so far. `thumb` and `midstate` are named but not settled, and entries marked *example only* show where other local regions and neighboring states would slot in; don't carry them. If your area uses or wants a local region, agree on it with operators nearby and propose it through the [RFC](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning).

**Naming rules.** Short, lowercase letters, digits and hyphens, with no `#`. Spelling must match exactly on every repeater, because a different spelling is a different region.

## Open Items {#open-items}

- Coordinating `midwest` with neighboring meshes, so it's a deliberate choice there too and not a default.

## Learn More {#learn-more}

MeshCore's own guides suggest setting a default scope right away. In Michigan, that becomes the recommendation at step 2 of the rollout; until then, keep it blank unless you're experimenting.

- [MeshCore documentation](https://docs.meshcore.io/) and [command reference](https://docs.meshcore.io/cli_commands/), for technical details
- MeshCore blog: [region filtering](https://blog.meshcore.io/2026/01/20/region-filtering) and [default scope](https://blog.meshcore.io/2026/04/17/default-scope)
- [MeshCore on GitHub](https://github.com/meshcore-dev/MeshCore): source code, releases and proposals
- [RFC-001 and Addendum A](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning): Michigan's region names, county assignments and draft scoping policy
- [Pacific Northwest region rollout](https://gessaman.com/meshcore/regions/rollout/): how another community staged it

## Change History {#change-history}

- 2026-10 — Page created during step 1 of the rollout: repeaters define regions only. The rollout follows RFC-001 Addendum A, without its repeater default scope or its one-week trial of limiting unscoped messages. Firmware 1.16 is the minimum.
