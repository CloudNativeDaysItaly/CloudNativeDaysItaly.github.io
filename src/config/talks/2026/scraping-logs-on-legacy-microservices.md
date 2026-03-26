---
id: scraping-logs-on-legacy-microservices
title: 'Scraping logs on legacy microservices: an adventure in the land of YAML descriptors'
type: talk
speakerIds:
  - giorgia-rondinini
tags:
  - ITA
level: Intermediate
image: ''
video: ''
slide: ''
---

Scrape from stdout, parse, send to Grafana Loki: told like that, it seems pretty easy to organize log scraping, right? This talk will describe the transition process from the complex initial situation to a cleaner and tidier one, with applications all logging on stdout and developers all reading logs from Loki. The tool used to manage scraping in this transition is the Logging Operator and this talk will focus on how its Custom Resource can be combined and managed.
