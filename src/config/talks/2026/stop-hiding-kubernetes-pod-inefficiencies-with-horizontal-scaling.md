---
id: stop-hiding-kubernetes-pod-inefficiencies-with-horizontal-scaling
title: 'Stop Hiding Kubernetes Pod Inefficiencies With Horizontal Scaling'
type: talk
speakerIds:
  - luca-vassallo
  - graziano-casto
tags:
  - ITA
level: all
image: ''
video: ''
slide: ''
---

Horizontal scaling is often the default response to increased load on Kubernetes, but it can mask deeper inefficiencies within the single pod. At EssilorLuxottica, we discovered that adding more replicas often just scales the waste.

If a single pod isn't optimized, you aren't scaling, you are just over-spending until you hit the HPA maxReplicas limit and the system eventually fails.
In this interactive "choose your own adventure" session, we will re-live our optimization journey. The audience will decide the configuration: should we tweak the runtime heap or the K8s resource limits? Using data from our actual experiments, we'll see the impact on throughput and costs, explaining the technical "why" behind each result.

We'll show that true efficiency comes from the synergy between runtime settings and pod configurations. You'll learn how to integrate automated experimentation into your delivery process to replace guesswork with data. This approach allowed us to reduce memory by 56% and costs by 30% while ensuring the system remains stable under load.
