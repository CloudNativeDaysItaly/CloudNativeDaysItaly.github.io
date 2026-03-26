---
id: gitops-at-scale-why-your-hub-and-spoke-architecture-is-a-security-risk
title: 'GitOps at Scale: Why Your Hub-and-Spoke Architecture is a Security Risk'
type: talk
speakerIds:
  - artem-lajko
  - gianluca-mardente
tags:
  - ENG
level: Intermediate
image: ''
video: ''
slide: ''
---

Hub-and-Spoke has become the default architecture for many GitOps based platforms. It is easy to understand, promises centralized control, and offers a single pane of glass for operating Kubernetes fleets.

But at scale, this model becomes dangerous.

In this talk, we explain why traditional (push) Hub-and-Spoke GitOps architectures fail when managing hundreds or thousands of clusters and especially when they are not agent-based. Centralizing privileged cluster credentials in a single management hub creates a "God-mode" security risk: compromise the hub, and you compromise the entire fleet.

We start with a short comparison of Argo CD and Sveltos, two open-source GitOps tools with fundamentally different architectural approaches. From there, we dive deep into the real challenges of GitOps at scale:

- Security risks caused by storing highly privileged cluster credentials in the hub
- Hub scalability limits and bottlenecks (resources, performance, blast radius)
- Why inbound connectivity (hub -> firewall -> cluster) is risky — or impossible in edge, semi-air-gapped, or regulated environments
- How multi-tenancy breaks down when the hub deploys applications, add-ons, and third-party tools for many teams

We show how an agent-based, pull-driven GitOps approach allows teams to keep the familiar Hub-and-Spoke model without inheriting its risks: no inbound access, no centralized superuser credentials, reduced blast radius, and clean multi-tenancy boundaries.

This is not a theoretical discussion. We will prove it with a live demo, showing GitOps at scale using an agent-based push and pull architecture in practice.
