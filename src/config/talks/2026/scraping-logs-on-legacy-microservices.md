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

Scrape from stdout, parse, send to Grafana Loki: told like that, it seems pretty easy to organize log scraping, right? A standard configuration, widely supported by many tools, for which configuration examples abound. But this "pretty easy" setup makes two important assumptions: that the applications log on stdout, and that developers want logs sent to Grafana Loki.
In the specific situation this talk focuses on, neither assumption is, sadly, true: some application logs on multiple files, some logs on stdout, some logs on both, and developers are used to read logs from files on a volume. Such a beautiful brown field, isn't it?
This talk will describe the transition process from the complex initial situation to a cleaner and tidier one, with applications all logging on stdout and developers all reading logs from Loki. The tool used to manage scraping in this transition is the Logging Operator and this talk will focus on how its Custom Resource can be combined and managed to support the transition and the final target scraping model.
