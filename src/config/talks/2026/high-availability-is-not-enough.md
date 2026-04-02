---
id: high-availability-is-not-enough
title: 'High Availability is not enough: Surviving failure in Cloud-Native architectures'
type: talk
speakerIds:
  - enrico-la-sala
tags:
  - ITA
level: Intermediate
image: ''
video: ''
slide: ''
---

Cloud-native environments often promise high availability, but real production systems still fail in ways that managed services and standard patterns alone can't prevent.
This session digs into the real failure modes encountered in large-scale distributed systems, from cascading retries and dependency latency spikes to partial outages and resilience gaps that only surface under real load.

Drawing from real production incidents in cloud-native systems, this talk focuses on how failures actually propagate in distributed environments and why high availability alone is not enough.
We'll walk through concrete failure scenarios and architecture examples to show how patterns like circuit breakers, bulkheads, and graceful degradation behave under stress, and how observability plays a key role in detecting and containing incidents.

Based on lessons learned from operating real systems, the session shares practical strategies used to improve resilience without over-engineering, highlighting trade-offs, common anti-patterns, and decisions that made a measurable difference in production.
