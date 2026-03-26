---
id: the-truth-about-gpu-sharing-in-multi-tenant-kubernetes
title: 'The Truth About GPU Sharing in Multi-Tenant Kubernetes'
type: talk
speakerIds:
  - nurudeen-kamilu
tags:
  - ENG
level: Intermediate
image: ''
video: ''
slide: ''
---

We've all been there: you finally secure a high-end GPU for your cluster, only to realize that assigning a massive card to a single small pod is a huge waste of money. So you try to share it. But GPU sharing today requires a careful strategy because when it's misconfigured, things quickly turn into chaos. A single rogue AI training job can crash an entire GPU node, taking down multiple production inference pods along with it.

This session is targeted to address exactly these challenges. We'll break down how GPU sharing actually works and why it often doesn't. We'll take a deep dive into the illusion of resource isolation provided by GPU time-slicing and NVIDIA Multi-Process Service (MPS), which is fast but risky in multi-tenant environments. We'll also discuss why vGPU frequently introduces more operational and management overhead than it solves.

Finally, we'll bridge the gap between hardware capabilities and orchestration by exploring how Dynamic Resource Allocation (DRA) combined with Multi-Instance GPU (MIG) enables true hardware isolation. This approach allows GPUs to be dynamically partitioned into isolated slices based on real workload demand.

By the end of the session, attendees will leave with a clear blueprint for building a multi-tenant GPU cluster that delivers strong isolation for security and stability, while still achieving high utilization and predictable performance through dynamic partitioning.
