---
id: gpu-is-not-monolithic-packing-llms-with-migs-on-kubernetes
title: 'GPU is not Monolithic : Packing LLMs with MIGs on Kubernetes'
type: talk
speakerIds:
  - hajed-khlifi
tags:
  - ENG
level: Intermediate
image: ''
video: ''
slide: ''
---

Most of the LLM workloads now are deployed on Kubernetes clusters with GPU nodes and let's be honest this is the most expensive resource in the cluster. Currently, using GPUs in passthrough mode locks a single model to an entire GPU, leading to severe underutilization (~30%). In this talk I will explain how to manage GPU resources in an efficient way and  attendees will understand how GPU cards are configured  in a Kubernetes cluster, what is the difference between the three main Nvidia GPU installation modes: Passthrough, vGPU and MIG and how everything works behind the scene. I will demonstrate how Multi instance GPUs are the best solution for packing LLMs on Kubernetes and how it should be used in an advanced case scenario like packing multiple LLMs in the same cluster sharing the same GPUs without causing the noisy neighbor problem.
