# Push Notification using Vue.js, Redis and WebSocket

- [Push Notification using Vue.js, Redis and WebSocket](#push-notification-using-vuejs-redis-and-websocket)
  - [Run the Application using Local Redis Server](#run-the-application-using-local-redis-server)
    - [Install Redis](#install-redis)
    - [Clone Project](#clone-project)
    - [Run the WebSocket Server](#run-the-websocket-server)
    - [Run the Vue Web-client application](#run-the-vue-web-client-application)
    - [Push notifications to the application](#push-notifications-to-the-application)
  - [Run the Application using Azure Cache for Redis](#run-the-application-using-azure-cache-for-redis)
    - [Create an Azure Cache for Redis cache instance](#create-an-azure-cache-for-redis-cache-instance)
    - [Set up Environment Variables](#set-up-environment-variables)
    - [Connect to Azure Cache for Redis server](#connect-to-azure-cache-for-redis-server)
    - [Run the WebSocket Server](#run-the-websocket-server-1)
    - [Run the Vue Web-client application](#run-the-vue-web-client-application-1)
    - [Run the Vue Web-pub application](#run-the-vue-web-pub-application)
    - [Push notifications to the application](#push-notifications-to-the-application-1)
  - [References](#references)

This small project allow you to push notificatio in a Vue application from a Redis `PUBLISH` using WebSockets.

![notification-demo](https://user-images.githubusercontent.com/541250/80476373-96def200-894a-11ea-88f3-f69f8decc88e.gif)

## Run the Application using Local Redis Server

### Install Redis

**Using Docker:**

If you don't have Docker installed on your computer, you need to install it before you can continue. When you have Docker running, you can run this command to start the redis server:

```
docker run --name <CONTAINER_NAME> -p 6379:6379 -d redis
```

**Using Homebrew (Mac):**

To install:

```
brew install redis
```

To run:

```
redis-server
```

or

```
brew services start redis
```

---

### Clone Project

```
> git clone https://github.com/mdrhmn/vue-redis-websocket-notification.git

> cd vue-redis-websocket-notification

```

---

### Run the WebSocket Server

You can change the HTTP Port and the Redis connection string in the `./notif-server/server.js`.

```
> cd ./notif-server

> npm install

> npm start server.js

```

---

### Run the Vue Web-client application

```
> cd ./web-client

> npm install

> npm run serve
```

Open your browser to http://localhost:8080

---

### Push notifications to the application

Open `redis-cli` in Terminal [Redis Insight](https://redislabs.com/redisinsight/) and publish messages on the `app:notifications` channel.

```
> redis-cli

127.0.0.1:6379> PUBLISH app:notifications "Hello from Redis!"
127.0.0.1:6379> PUBLISH app:notifications "Another message!"
```

You should see some notifications poping up in the Vue application.


## Run the Application using Azure Cache for Redis

### Create an Azure Cache for Redis cache instance

Refer to this [official Microsoft documentation](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-nodejs-get-started)

---

### Set up Environment Variables

Windows:

```powershell

set REDISCACHEHOSTNAME=DNS_NAME.redis.cache.windows.net
set REDISCACHEKEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

```

MacOS:

```bash

export REDISCACHEHOSTNAME=DNS_NAME.redis.cache.windows.net
export REDISCACHEKEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

```

---

### Connect to Azure Cache for Redis server

Amend the Redis client connection in the `notif-server/server.js` file:

```javascript
// notif-server/server.js

// METHOD 2: Using Azure Cache for Redis server
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
redisClient.subscribe("app:notifications");
```

---

### Run the WebSocket Server

You can change the HTTP Port and the Redis connection string in the `./notif-server/server.js`.

```
> cd ./notif-server

> npm install

> npm start server.js

```

---

### Run the Vue Web-client application

```
> cd ./web-client

> npm install

> npm run serve
```

Open your browser to http://localhost:8080

---
### Run the Vue Web-pub application

```
> cd ./web-pub

> npm install

> npm start
```

Send GET request to http://localhost:3015

---
### Push notifications to the application

Unlike local Redis server connection, `redis-cli` doesn’t work with SSL connections. There are 3 ways to use `redis-cli` for Azure Cache for Redis server:

1. Disable SSL-only configuration (not recommended due to security concerns)

2. Connect using the Azure console 

    ![img](https://miro.medium.com/max/778/1*FIPJmhpePUaxOxEoIFa1MA.png)

    Open the console and publish messages on the `app:notifications` channel.

    ```
    > PUBLISH app:notifications "Hello from Redis!"
    > PUBLISH app:notifications "Another message!"
    ```

    You should see some notifications poping up in the Vue application.

3. Using `stunnel` to tunnel your redis connection over a TLS connection

    Refer to the [Medium tutorial](https://medium.com/@therealjordanlee/connecting-to-azure-cache-redis-with-redis-cli-and-stunnel-6e5c5479bc2c) or [official Microsoft documentation](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-redis-cli-tool)

---

## References

1. [How to Create Notification Services with Redis, Websockets, and Vue.js](https://redis.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/)
2. [Build a notification service with Redis, Web Sockets and Vue.js](https://youtu.be/TFoDRszO36w)
3. [Quickstart: Use Azure Cache for Redis in Node.js](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-nodejs-get-started)
4. [Use the Redis command-line tool with Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-redis-cli-tool)
5. [Connecting to Azure Cache (Redis) with redis-cli and stunnel](https://medium.com/@therealjordanlee/connecting-to-azure-cache-redis-with-redis-cli-and-stunnel-6e5c5479bc2c)
6. [Implementing Redis Pub/Sub in Node.js Application](https://cloudnweb.dev/2019/08/implementing-redis-pub-sub-in-node-js-application/)