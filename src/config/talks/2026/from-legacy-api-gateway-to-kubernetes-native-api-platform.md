---
id: from-legacy-api-gateway-to-kubernetes-native-api-platform
title: 'From Legacy API Gateway to Kubernetes-native API Platform: a Real-world battlefield report'
type: talk
speakerIds:
  - luca-de-carne
tags:
  - ENG
level: Intermediate
image: ''
video: ''
slide: ''
---

Migrating an enterprise API gateway from a legacy system to Kubernetes has no consolidated playbook. Every architectural decision triggers a chain of operational choices that only surface mid-implementation when you're dealing with live traffic, real teams, and infrastructure constraints you couldn't have predicted.
In this talk, we share a real-world battlefield report: building a hybrid API platform on Kubernetes - with self-hosted data planes running in both on-premises and cloud environments - starting from a commercial legacy gateway in production.
We walk through how we assembled this system layer by layer: the data plane lifecycle managed with ArgoCD as the continuous delivery, exposure to the internet across heterogeneous infrastructure with MetalLB on-premises and native cloud load balancers, the migration of API configuration using OpenAPI 3.0 as a transition format toward a fully declarative model, and multi-team governance with domain-isolated control planes and cross-team aggregation.
Is this a "definitive guide"? No. And that's exactly the point. We are deep-diving into a working blueprint, sharing the trade-offs and the hard lessons learned by those who actually built it.
