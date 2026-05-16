---
id: osservabilita-by-design-con-otel-weaver
title: 'Osservabilità by Design con OTel Weaver'
type: talk
speakerIds:
  - marco-pernigo
tags:
  - ITA
level: Beginners
image: ''
video: ''
slide: ''
---

Non rilasceresti un'API senza uno schema, né faresti il deploy dell'infrastruttura senza codice. Allora perché continuiamo a mandare metriche, tracce e log in produzione senza alcun contratto? Il risultato è prevedibile: dashboard rotte dopo i deploy, strumentazione mancante scoperta durante gli incident, ogni team che inventa le proprie convenzioni di naming, e costi on-prem o SaaS che crescono perché nessuno sa cosa valga davvero la pena tenere. La telemetria viene trattata come un dettaglio secondario, e si vede negli alert, nell'MTTR e nella fattura.

OpenTelemetry Weaver cambia questo scenario. È Infrastructure-as-Code per l'osservabilità: definisci la tua telemetria come uno schema machine-readable, un registry di ogni metrica, span e attributo di log che la tua applicazione dovrebbe emettere, poi lo validi in CI, generi codice di strumentazione, generi documentazione e fai live-check (`weaver live-check`) dell'applicazione in esecuzione rispetto a quel contratto. La telemetria diventa un'API versionata, revisionabile e applicabile. Sai esattamente cosa stai emettendo, il che significa che puoi eliminare ciò che non serve e tenere sotto controllo sia il rumore che i costi.

Non è teoria: il progetto OpenTelemetry stesso usa Weaver per validare il proprio registry di oltre 900 attributi delle semantic conventions, generare le costanti degli SDK in più linguaggi, e pubblicare la documentazione semconv su opentelemetry.io.

Se sei un platform engineer, un SRE o chiunque sia responsabile degli standard di osservabilità nella propria organizzazione, questo talk ti mostrerà come trattare la telemetria come un contratto di prima classe, non come un dettaglio aggiunto all'ultimo momento.

