---
id: centralizzare-i-log-in-ambienti-multi-cluster-con-loki-architettura-e-casi-duso
title: 'Centralizzare i Log in ambienti Multi-cluster con Loki: Architettura e Casi d''Uso'
type: talk
speakerIds:
  - marco-ferraioli
tags:
  - ITA
level: Intermediate
image: "/images/talks/centralizzare-i-log-in-ambienti-multi-cluster-con-loki-architettura-e-casi-duso.webp"
video: 'https://www.youtube.com/watch?v=h3eVQjssZmA'
slide: ''
---

In ambienti Kubernetes multi-cluster, correlare eventi e risolvere problemi è complesso: i servizi distribuiti generano enormi volumi di log frammentati tra cluster diversi, mettendo in difficoltà le soluzioni di logging tradizionali sia per prestazioni che per storage.

Questo talk dimostra come Grafana Loki, una soluzione open source progettata per garantire il pieno controllo sui propri dati, permetta di costruire un sistema di logging centralizzato. Presenterò un caso reale di implementazione in una cluster mesh, evidenziando come la sua architettura basata su etichette e storage distribuito consenta di gestire efficacemente i log.

Durante la sessione verranno mostrate le tecniche di implementazione di Loki in ambiente multi-cluster, i pattern per correlare efficacemente i log tra servizi distribuiti e le strategie di ottimizzazione per gestire grandi volumi di dati, il tutto con un approccio cloud native.
