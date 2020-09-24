# Queue Filter for Real-Time Queues View

This Flex Plugin allows you to apply filtering by the queue in the table within Real-Time Queues View.

<p align="center">
    <img src="src/images/rt_queue_view_filter.png?raw=true" width="600" >
</p>

---

## Setup

### Requirements

- An active Twilio account. [Sign up](https://www.twilio.com/try-twilio) if you don't already have one.

- Real-time Queues View enabled. The feature can be activated via Twilio Console Admin -> Pre-release Features -> REAL-TIME QUEUES VIEW.

- Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

---

## Local development

1. Clone this repository.
2. Rename the example app configuration file.
3. Install dependencies.

```bash
npm install
```

4. Run the application.

```bash
npm start
```

5. Navigate to [http://localhost:3000](http://localhost:3000).

When you make changes to your code, the browser window will be automatically refreshed.

---

## Deploy

When you are ready to deploy your plugin, in your terminal run:

```bash
npm run deploy
```

This will publish your plugin as a Private Asset that is accessible by the Functions & Assets API.

---

## Changelog

### 1.1

**September 24, 2020**

- Added a test suite, github actions and prettier.

### 1.0

**September 10, 2020**

- Added README.
