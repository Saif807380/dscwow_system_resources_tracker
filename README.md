# System Resources Tracker for Cloud Intances

Monitor system metrics for all cloud services from one place. View CPU or memory usage, running processes and even access the terminal with a dead simple dashboard

## Why this is necessary?

- As we scale an application, it becomes difficult to monitor and access services on different cloud providers
- Tbh, cloud providers have very complicated dashboards
- No need for constant monitoring, get an email as soon as your resource usage spikes

## Features

- Resource tracking of compute instances
- Real-time data visualization of resources
- Interactive shell access to the instance
- Alerts when resources are critical
- Multi-provider support
- Easy Configuration

---

## Setup

### Folder Structure

```
.
├── README.md
├── client
│   ├── README.md
│   ├── babel.config.js
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   └── src
├── instance
│   ├── Dockerfile
│   ├── README.md
│   ├── monitoring.service
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── yarn.lock
├── instance.zip
└── server
    ├── README.md
    ├── app.js
    ├── handlers
    ├── helpers
    ├── middlewares
    ├── models
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    └── routes

14 directories, 16 files
```

### Instructions

- [Client](https://github.com/Saif807380/dscwow_system_resources_tracker/blob/main/client/README.md)
- [Server](https://github.com/Saif807380/dscwow_system_resources_tracker/blob/main/server/README.md)
- [Instance](https://github.com/Saif807380/dscwow_system_resources_tracker/blob/main/instance/README.md)

---

## Additional Links

- [Presentation](https://docs.google.com/presentation/d/1fAGF57-XQQGrtyR06XTCDdTK276LozUCMqicX-tTdTc/edit?usp=sharing)
