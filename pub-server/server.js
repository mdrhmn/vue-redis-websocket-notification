const express = require("express")
const redis = require("redis")

var cacheHostName = process.env.REDISCACHEHOSTNAME;
var cachePassword = process.env.REDISCACHEKEY;

async function testCache() {

const publisher = redis.createClient({
    url: "rediss://" + cacheHostName + ":6380",
    password: cachePassword,
  });
  
await publisher.connect();

const app = express();

app.get("/", (req, res) => {
  const user = {
    id: "123456",
    name: "Davis",
  }
  publisher.publish("app:notifications", JSON.stringify(user))
  res.send("Publishing an Event using Redis")
})
// Next: Change to POST request with request body

app.listen(3015, () => {
  console.log(`server is listening on PORT 3015`)
})

}

testCache()


