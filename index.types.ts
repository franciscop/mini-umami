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
  umami.server({});

  umami.id = "abc";
  umami.tracker = "abc";
  umami.agent = "abc";
})();
