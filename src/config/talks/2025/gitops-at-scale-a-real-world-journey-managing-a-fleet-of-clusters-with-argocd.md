---
id: gitops-at-scale-a-real-world-journey-managing-a-fleet-of-clusters-with-argocd
title: 'GitOps at Scale: A Real-World Journey Managing a Fleet of Clusters with ArgoCD'
type: talk
speakerIds:
  - massimo-groppelli
  - luca-carini
tags:
  - ITA
level: Intermediate
image: '/images/talks/gitops-at-scale-a-real-world-journey-managing-a-fleet-of-clusters-with-argocd.webp'
video: 'https://www.youtube.com/watch?v=rPg8GQsPYag'
slide: ''
---

In questa sessione ripercorriamo il percorso evolutivo dell’adozione del modello GitOps su larga scala in Zucchetti, in un contesto enterprise su cloud privato, per standardizzare la Continuous Delivery su una flotta eterogenea di cluster.

Una volta superata l'adozione iniziale del paradigma GitOps, abbiamo definito un’architettura per ArgoCD scalabile e riutilizzabile basata su pattern come App of Apps, Apps in any Namespace, hub-and-spoke e uso avanzato degli AppProject per abilitare la multi-tenancy.

Illustreremo le soluzioni adottate per affrontare temi come la gestione dell'RBAC, la propagazione delle configurazioni infrastrutturali e applicative, bilanciamento del carico e ottimizzazione del consumo risorse.

Condivideremo inoltre l’integrazione di pratiche FinOps per tracciare i costi, attribuirli ai team e garantire sostenibilità.

Concluderemo con uno sguardo al futuro introducendo un nuovo approccio multicluster pull-based come alternativa all'attuale approccio push-based.
