const app = require("express")();

// IMPORTANT
// DON'T FORGET TO INSTALL && LAUNCH REDIS SERVER ON MACHINE FIRST
const redis = require("redis");
const cache = redis.createClient();

app.get("/", (req, res, next) => {
  console.log("new incoming GET request");
  cache.setex("hello", 3600, "world");
  console.log("cache set");
  res.status(200).json({ key: "hello" });
});

app.get("/cache", (req, res, next) => {
  cache.get("hello", (e, data) => {
    if (e) return res.status(404).send(JSON.stringify({ error: e.message }));

    if (!data) return res.status(404).send(JSON.stringify({ data: null }));
    res.status(200).send(JSON.stringify({ data }));
  });
});

cache.on("error", (e) => console.log("Cache error:", e.message));

cache.on("ready", () => {
  console.log("redis client ready");

  // all the other stuffs
  app.listen(9999, () => console.log("Server running on port 9999"));
});
