const express = require("express")
const redis = require("redis")
const EXPRESS_PORT = 3015;
const CHANNEL_NAME = "app:notifications";

// METHOD 1: Using local Redis server
// Configuration: adapt to your environment
// const REDIS_LOCAL_SERVER = "redis://localhost:6379";

// METHOD 2: Using Azure Cache for Redis server
// Connect to the Azure Cache for Redis over the TLS port using the key.
var cacheHostName = process.env.REDISCACHEHOSTNAME;
var cachePassword = process.env.REDISCACHEKEY;

async function publishMessage() {

  // METHOD 1: Using local Redis server
  // Connect to Redis and subscribe to "app:notifications" channel
  // var redisClient = redis.createClient(REDIS_LOCAL_SERVER);

  // METHOD 2: Using Azure Cache for Redis server
  const publisher = redis.createClient({
    // With Azure Cache for Redis, only the TLS port (6380) is enabled by default. 
    // https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-redis-cli-tool
    url: "rediss://" + cacheHostName + ":6380",
    password: cachePassword,
  });

  await publisher.connect();

  // Create Express server
  const app = express();

  app.get("/", (req, res) => {
    const message = {
      id: "123456",
      name: "Davis",
    }

    // Publish message to channel
    publisher.publish(CHANNEL_NAME, JSON.stringify(message))
    res.send("Publishing an Event using Redis")
  })

  // Next: Change to POST request with request body
  app.listen(EXPRESS_PORT, () => {
    console.log("Express server is listening on PORT " + EXPRESS_PORT)
  })

}

publishMessage()


