---
id: pok8s-the-art-of-curated-kubernetes-os-images
title: 'Pok8s: The Art of Curated Kubernetes OS Images'
type: talk
speakerIds:
  - mauro-morales
tags:
  - ENG
level: Beginners
image: '/images/talks/pok8s-the-art-of-curated-kubernetes-os-images.webp'
video: 'https://www.youtube.com/watch?v=MFKnS6fnTkk'
slide: ''
---

In the age of containers and abstraction, we’re told the operating system no longer matters. That you can run anything on anything. But the reality is more nuanced — your organization might have deep expertise in a specific distro, licensing constraints, or compliance requirements that shape your stack from the kernel up. And the same applies to your Kubernetes flavor of choice.

But setting up your Kubernetes infrastructure shouldn’t feel like you’re out at sea — catching the fish, cleaning it, and prepping every ingredient from scratch. Instead, it should feel like walking into your favorite poke spot: the freshest options already hand-picked for you, curated with care, and ready for you to assemble exactly the way you like it. That’s the experience Kairos Factory brings to infrastructure — letting you focus on what matters, while still getting a stack tailored to your exact taste.

In this talk, we introduce Kairos Factory, a web-based builder that lets you assemble secure, immutable Kubernetes-ready OS images tailored to your needs. Think of it as Pok8s — your build-your-own Kubernetes Poke Bowl. Choose your base OS (Ubuntu, Alpine, etc.), pick your Kubernetes distribution (k3s, k0s), toss in your configuration toppings (VPNs, CRDs, mesh configs), and layer on your favorite sauces — TPM-backed boot, full-disk encryption, and other security features.

Unlike opinionated open-source stacks that lock you into their tooling or upgrade paths, Kairos is truly composable — you can swap any layer without rebuilding your world. It’s designed for flexibility without compromise, giving you a declarative, production-grade OS image with full control from kernel to kubelet.

Through live demos and real-world scenarios, we’ll explore how Kairos enables teams to take control of their infrastructure without abandoning existing know-how or processes. Whether you’re deploying to edge devices, bare metal, or cloud instances, you’ll walk away with a new model for curated infrastructure — not just composed systems.

And maybe, just maybe, a craving for sushi.
