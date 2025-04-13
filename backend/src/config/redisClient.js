const redis = require("redis");

// Connect to Redis
const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379", // Update if using a remote Redis server
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

redisClient.connect(); // Redis v4 requires async connection

module.exports = redisClient;
