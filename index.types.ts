import umami from "./index.js";

(async () => {
  await umami.view("/path");
  await umami.event("/path");

  await umami.view("/path", {
    id: "abc",
    ip: "abc",
    agent: "abc",
    tracker: "abc",
    language: "abc",
    referrer: "abc",
    hostname: "abc",
    screen: "abc",
    data: { a: "b", c: "d" },
  });

  await umami.event("/path", {
    id: "abc",
    ip: "abc",
    agent: "abc",
    tracker: "abc",
    language: "abc",
    referrer: "abc",
    hostname: "abc",
    screen: "abc",
    data: { a: "b", c: "d" },
  });

  umami.express({}, {}, () => {});

  const ctx = {
    headers: { referer: "https://example.com/" },
    url: new URL("https://example.com/path"),
  };
  umami.server({ ...ctx, platform: { production: true } });
  umami.server({ ...ctx, machine: { production: true } });

  umami.id = "abc";
  umami.tracker = "abc";
  umami.agent = "abc";
})();
