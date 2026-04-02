---
id: building-platforms-with-crossplane
title: 'Building Platforms with Crossplane: A Hands-On Introduction'
type: workshop
speakerIds:
  - riccardo-capraro
tags:
  - ITA
level: Beginners
image: ''
video: ''
slide: ''
---

In this hands-on workshop, we'll take you from zero to building your first internal developer platform with Crossplane. Whether you've heard about Crossplane but never touched it, or built a small PoC but got stuck going further, this workshop is for you.

###  Who should attend ###
DevOps engineers, platform engineers, cloud engineers, and technical leads who want a practical, guided introduction to Crossplane. Beginner-friendly - no prior Crossplane experience required.

### What you'll learn ###

By the end of this workshop, you will:
- Understand what Crossplane is, how it works, and when it makes sense to use it (vs. alternatives like a Terraform module in a pipeline)
- Know the core building blocks: Providers, Managed Resources, Composite Resource Definitions (XRDs), Compositions, and Functions
- Be able to create managed resources and write a basic Composition for a real-world use case
- Understand how Crossplane fits into the bigger picture: GitOps, platforms, and team self-service

### How it works ###
The workshop is split into thee parts:
1. Short intro on key Crossplane concepts
A focused introduction covering Crossplane's architecture and resources, how it extends Kubernetes with CRDs and controllers, and where it fits in the IaC and platform engineering landscape.
2. Hands-On Lab
Working in small teams (or solo), you'll build a working platform from a curated set of guided exercises.
3. Wrap-up and your questions
A dedicate slot for your questions and to talk about real-world experience: what works, what doesn't, and how to go from workshop to production. We'll cover how to organize your code and repos, and what the path looks like to roll out Crossplane in an organization.

### How to prepare ###
You bring the laptop, we give you the environment. Nothing else needed (except a Github account).

### What we expect from you ###
- Basic Kubernetes knowledge: you can use kubectl, you know what a Deployment and a Service are, and you've heard of CRDs and controllers
- An idea of what IaC and GitOps mean - not intricate setups, just the general principles

### Bonus ####
What we can optionally dive into during the Q/A se:

- Using different languages for Compositions (Python, KCL, Go)
- Writing a custom provider or function
- Packaging configurations into OCI images with dependency management
- Setting up Crossplane with ArgoCD / GitOps
- Integration with policy engines (OPA, Kyverno)
- Testing strategies: rendering, assertions, and E2E
