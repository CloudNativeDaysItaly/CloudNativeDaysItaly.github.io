---
id: what-should-a-cloud-native-os-look-like
title: 'What Should a Cloud-Native OS Look Like? Rethinking the Foundation of Modern Platforms'
type: talk
speakerIds:
  - mauro-morales
tags:
  - ENG
level: Intermediate
image: ''
video: ''
slide: ''
---

Cloud-Native platforms are built around declarative APIs, reconciliation, and rapid change, yet the operating systems underneath them are often still upgraded in place, mutated over time, and treated as infrastructure details rather than part of the platform contract.

In this talk, we'll look at the operating system through a cloud-native platform lens: not as a Linux distribution to manage, but as a foundational component that directly impacts platform velocity, safety, and ownership boundaries.

We'll explore what changes when cloud-native principles are applied all the way down to the OS. Rather than diving into OS internals, the talk focuses on the contracts and guarantees the OS provides and how they translate into platform outcomes: safer upgrades with smaller blast radius, clearer separation of responsibilities between infra and platform teams, faster adoption of upstream features, and fewer surprises for teams building and evolving platforms on top.

We'll share lessons learned from building Hadron, a Cloud-Native OS designed around these ideas, and discuss where this model helps, and where it challenges existing assumptions.
