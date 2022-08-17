# Push Notification using Vue.js, Redis and WebSocket

This small project allow you to push notificatio in a Vue application from a Redis `PUBLISH` using WebSockets.

![notification-demo](https://user-images.githubusercontent.com/541250/80476373-96def200-894a-11ea-88f3-f69f8decc88e.gif)


## Run the Application

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

### Run the Vue Web Front application

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

## References

1. [How to Create Notification Services with Redis, Websockets, and Vue.js](https://redis.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/)
2. [Build a notification service with Redis, Web Sockets and Vue.js](https://youtu.be/TFoDRszO36w)