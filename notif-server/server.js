const WebSocket = require('ws');
const redis = require('redis');
const WEB_SOCKET_PORT = 3000;

// METHOD 1: Using local Redis server
// Configuration: adapt to your environment
// const REDIS_LOCAL_SERVER = "redis://localhost:6379";

// Connect to Redis and subscribe to "app:notifications" channel
// var redisClient = redis.createClient(REDIS_LOCAL_SERVER);

/* -------------------------------------------------------------------------- */

// METHOD 2: Using Azure Redis server
// Connect to the Azure Cache for Redis over the TLS port using the key.
var cacheHostName = process.env.REDISCACHEHOSTNAME;
var cachePassword = process.env.REDISCACHEKEY;
var redisClient = redis.createClient({
  // With Azure Cache for Redis, only the TLS port (6380) is enabled by default. 
  // https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-redis-cli-tool
  url: "rediss://" + cacheHostName + ":6380",
  password: cachePassword,
});

/* -------------------------------------------------------------------------- */

// Subscribe to "app:notifications" channel
redisClient.subscribe('app:notifications');

// Create & Start the WebSocket server
const server = new WebSocket.Server({ port: WEB_SOCKET_PORT });

// Register event for client connection
server.on('connection', function connection(ws) {

  // broadcast on web socket when receving a Redis PUB/SUB Event
  redisClient.on('message', function (channel, message) {
    console.log(message);
    ws.send(message);
  })

});

console.log("WebSocket server started connect to ws://locahost:" + WEB_SOCKET_PORT);