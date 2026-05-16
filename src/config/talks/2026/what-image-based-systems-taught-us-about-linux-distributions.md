---
id: what-image-based-systems-taught-us-about-linux-distributions
title: 'What Image-Based Systems Taught Us About Linux Distributions: Lessons From Kairos and Why We Built Hadron'
type: lightning-talk
speakerIds:
  - mauro-morales
tags:
  - ENG
  - SPONSORED
level: all
image: ''
video: ''
slide: ''
---

Over the last several years, the Kairos project has built image-based, immutable systems on top of multiple Linux distributions like Ubuntu, Debian, Alpine and others. This experience has revealed a recurring set of engineering constraints shared across traditional distros: assumptions about package managers, filesystem layout, dependency chains, downstream patches, boot tooling, or init system behavior that work well for classic installations, but create friction in image-based, cloud-native and edge-focused environments.

This talk presents the design principles that emerged from this work: minimal bases, upstream-first components, predictable boot paths, trusted boot chains, reproducibility, and clear separation between the immutable system image and extensible runtime layers. We will discuss both the technical challenges and the architectural conclusions that followed.

These lessons ultimately led us to build Hadron, a new minimal Linux distribution developed by the Kairos team: musl-based, systemd-powered, upstream-aligned, and designed specifically for image-based systems. Hadron is not intended to replace any existing distribution; rather, it is a small, focused reference implementation of what an OS optimized for this model can look like.

The goal of this talk is to share practical insights with the wider distribution community and contribute to the ongoing evolution of image-based Linux.

Links:
- https://github.com/kairos-io/hadron
- https://github.com/kairos-io/kairos
- https://kairos.io/
