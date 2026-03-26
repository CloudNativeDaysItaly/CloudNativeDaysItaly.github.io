---
id: booting-into-kubernetes-with-an-immutable-os
title: 'Booting into Kubernetes with an Immutable OS'
type: talk
speakerIds:
  - santiago-merlos
tags:
  - ENG
level: Intermediate
image: ''
video: ''
slide: ''
---

Kubernetes platforms often struggle with configuration drift and inconsistent environments across clusters. Reproducing the exact same setup across nodes and environments can become complex when operating systems and system components evolve over time.

What if the operating system itself was immutable and fully controlled through declarative configuration?

In this session, maintainers of the SIGHUP Distribution will share how we designed an immutable Kubernetes platform built on top of Flatcar Container Linux, optimized for on-premises environments.

By removing traditional package managers and mutable system components, the platform eliminates configuration drift while reducing the attack surface. The operating system is preconfigured and tuned specifically for Kubernetes, with managed kernel parameters and system-level settings aligned with the architecture of the SIGHUP Distribution.

Custom system extensions are used to deliver tightly integrated components, improving cohesion between the operating system and the Kubernetes stack while preserving immutability, security, and operational consistency across all cluster nodes.

The session will include a live demo showing how we bootstrap a cluster from a PXE boot to a fully operational immutable Kubernetes cluster with a single command.

Along the way, we will explore how immutable infrastructure enables reproducible environments, declarative system management, and consistent platform operations for Kubernetes clusters.
