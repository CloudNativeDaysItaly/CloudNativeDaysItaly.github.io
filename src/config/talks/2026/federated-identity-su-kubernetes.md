---
id: federated-identity-su-kubernetes
title: "Federated Identity su Kubernetes per l'accesso ai servizi cloud senza credenziali"
type: talk
speakerIds:
  - federico-soave
  - federico-quaglia
tags:
  - ITA
level: Intermediate
image: ''
video: ''
slide: ''
---

In qualsiasi architettura ibrida, una delle principali sfide è integrare correttamente i metodi di autenticazione/autorizzazione dei diversi ambienti coinvolti.

Nel caso d'uso reale di una infrastruttura Adtech, abbiamo implementato una soluzione basata sul protocollo OIDC, eliminando la necessità di utilizzare credenziali locali, per supportare l'autenticazione verso diversi account AWS.
Per lo scopo di questa presentazione utilizzeremo AWS come esempio pratico, ma con le opportune modifiche il meccanismo è estensibile ad altri CSP.

Dopo aver delineato l'architettura e il setup, realizzato principalmente con CDK come strumento di IaC, analizzeremo i vantaggi e svantaggi, le criticità di sicurezza, le soluzioni alternative valutate, e i possibili sviluppi futuri.

Keywords: Kubernetes, OIDC, IRSA, federated identity, CDK, workload identity, JWT
