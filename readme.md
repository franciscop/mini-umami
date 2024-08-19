# Mini Umami [![npm install mini-umami](https://img.shields.io/badge/npm%20install-mini--umami-blue.svg)](https://www.npmjs.com/package/mini-umami) [![test badge](https://github.com/franciscop/mini-umami/workflows/tests/badge.svg "test badge")](https://github.com/franciscop/mini-umami/blob/master/.github/workflows/tests.yml) [![gzip size](https://badgen.net/bundlephobia/minzip/mini-umami?label=gzip&color=green)](https://github.com/franciscop/mini-umami/blob/master/src/index.js)

A tiny universal JS library for tracking with Umami API:

```js
import umami from "tiny-umami";

// Optional, otherwise will read process.env.UMAMI_ID
umami.id = "50429a93-8479-4073-be80-d5d29c09c2ec"; // Your website id

// Optional, otherwise will read process.env.UMAMI_TRACKER, or default to Umami Cloud
umami.tracker = "https://cloud.umami.is/"; // The Umami Tracker host URL, NOT your website tracker

// Track page views or events
await umami.view("/exercises", { ...options });
await umami.event("event-name", { ...options });

// If you use Express and want to track page views:
app.use(umami.express);
```

Compared to `@umami/node`:

- It's not blocked because of the User Agent [since this was a blocker issue](https://github.com/umami-software/node/issues/1).
- Allows you to pass the client's User Agent as [`agent`](#options).
- Allows you to pass the client's IP as [`ip`](#options).
- Has a Express connector that automates all of the above with a simple middleware.

## Options

You can set two options as the environment variables, with these names:

```
# .env
UMAMI_ID=50429a93-8479-4073-be80-d5d29c09c2ec
UMAMI_TRACKER=https://cloud.umami.is/
```

Otherwise, you can set those on the umami instance as:

- `umami.id`: the ID of the website you are tracking, it's mandatory.
- `umami.tracker`: the url of the domain where the Umami instance is running, defaults to Umami Cloud `https://cloud.umami.is/`.

Finally, the argument options available are:

- `id`: the ID of the website you are tracking, it's mandatory.
- `tracker`: the url of the domain where the Umami instance is running, defaults to Umami Cloud `https://cloud.umami.is/`.
- `agent`: the user agent of the user visiting. It will default to the most current Chrome one if not set [to avoid this bug](https://github.com/umami-software/node/issues/1).
- `hostname`: Hostname of server, e.g. `"core.cards"`.
- `language`: Client language, e.g. `"en-US"`.
- `referrer`: Page referrer, e.g. `https://x.com/`.
- `screen`: Screen dimensions (eg. 1920x1080)
- `title`: Page title
- `data`: Event data properties

They go, in order of preference: argument option, or instance option, or environment variable.

## API

All of the methods are async, but they can be awaited for or just not awaited for, in which case it will be deferred and complete eventually (for persistent servers, if you are in a lambda you might want to wait for it):

```js
umami.view("/hello"); // Will resolve later
await umami.view("/hello"); // Will block the rest of execution until resolution
```

### .view(path, options)

Track a pageview by passing the path to the function:

```js
umami.view("/hello");
```

You can configure [the rest of the options](#options):

```js
umami.view("/hello", {
  title: "Welcome Screen",
  agent: req.headers["user-agent"],
});
```

### .event(name, options)

Track a pageview by passing the path to the function:

```js
await umami.event("signup");
```

You can configure [the rest of the options](#options):

```js
await umami.event("/hello", { agent: req.headers['user-agent'], ... });
```

### .express(req, res, next)

Automatically track page views with Express:

```js
import umami from "mini-umami";

const app = express();
app.use(umami.express);

// ... other express routes
```

This method will automatically get extra information from Express like the `referrer`, `language`, `user-agent`, etc. However note that the screen size will be set as "1920x1080" for desktop and "360x720" for mobile since in the backend we cannot get the device size.
