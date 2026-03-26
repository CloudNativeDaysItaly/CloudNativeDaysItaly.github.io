---
id: one-repo-to-rule-them-all
title: 'One repo to rule them all: managing heterogeneous clusters with sveltos and gitops'
type: talk
speakerIds:
  - stefano-sibilia
  - gianluca-mardente
tags:
  - ITA
level: all
image: ''
video: ''
slide: ''
---

Managing distributed Kubernetes infrastructures across multiple cloud providers  GCP, AWS, Alibaba Cloud  with a mix of shared and cluster-specific requirements is a significant challenge. How do you deploy cert-manager, Kyverno, or  Ingress controllers across every cluster while handling different configurations for AWS NLBs versus GCP static IPs? How do you roll out AI services like LiteLLM only to specific environments?
In this talk, we present a production-proven approach used to manage diverse client clusters from a single management hub, leveraging Sveltos as the distribution engine and ArgoCD as the delivery layer for CRDs. We will dive into Two-tier Hub-and-Spoke Architecture, Label-based Opt-in Model, Configuration Layering and other features.
