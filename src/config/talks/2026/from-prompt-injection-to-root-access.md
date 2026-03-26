---
id: from-prompt-injection-to-root-access
title: 'From Prompt Injection to Root Access: Hardening LLMs with KubeArmor & ModelArmor'
type: talk
speakerIds:
  - gregorio-palama
tags:
  - BOTH
level: Intermediate
image: ''
video: ''
slide: ''
---

As organizations rush to deploy GenAI on Kubernetes, security often takes a backseat. But what if a simple prompt injection could escalate into a full container compromise? This talk explores a true Defense-in-Depth strategy for AI workloads.

We will see a live attack chain and, to counter it, there will be the implementation of a multi-layer defense using ModelArmor as an AI firewall and KubeArmor to enforce strict runtime security via eBPF. This will secure the AI stack from the prompt down to the system call, ensuring innovation doesn't come at the cost of control.
