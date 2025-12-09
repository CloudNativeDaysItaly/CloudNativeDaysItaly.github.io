---
id: how-to-use-kubernetes-to-control-a-vast-network-of-clusters
title: How to Use Kubernetes to Control a Vast Network of Clusters
type: talk
speakerIds:
  - gianluca-mardente
tags:
  - ENG
level: Intermediate
image: '/images/talks/how-to-use-kubernetes-to-control-a-vast-network-of-clusters.webp'
video: 'https://www.youtube.com/watch?v=EkioGUDzqbc'
slide: ''
---

Kubernetes is the container orchestration standard. It is expanding to distributed environments across datacenter, on-premises, public clouds. Managing multiple clusters for development, testing, and production in this complex landscape necessitates programmatic solutions.

Solutions exist to programmatic create and manage Kubernetes clusters using Kubernetes itself. ClusterAPI is one such popular solution. It provides a declarative approach to creating, managing, and upgrading Kubernetes clusters from a central management cluster.

Once a cluster is established, add-ons need to be deployed. In some cases, simply listing all required add-ons suffices. However, add-ons often have dependencies and require specific deployment orders. Additionally, external resources may need to be created and then utilised by applications within the cluster.

Solutions exist for programmatically defining which add-ons should be deployed where. Event frameworks handle dependencies programmatically.

For short-lived clusters, consistency and velocity are key, while long-lived clusters demand reduced administrative coordination. Consider a scenario where add-ons initially deployed to clusters running Kubernetes v1.30.x need to be updated to a new set upon upgrade to v1.31.x. Application administrators should only need to specify required add-ons for clusters in a particular state. Platform administrators can upgrade cluster and add-on updates automatically happens
