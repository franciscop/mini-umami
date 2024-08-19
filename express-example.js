import express from "express";

import umami from "./index.js";

const app = express();
const port = 3000;
// umami.id = "";  // <= To test it, fill this and deploy it in a proper domain

app.use(umami.express);

app.get("/", (req, res) => {
  const msg = " But remember it will only send Umami events in production";
  res.send("It works!" + (process.env.NODE_ENV === "production" ? "" : msg));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
