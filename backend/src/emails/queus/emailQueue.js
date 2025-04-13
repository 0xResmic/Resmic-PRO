const { Queue } = require('bullmq');
const Redis = require('ioredis');

// const connection = new Redis();
const connection = new Redis({
    maxRetriesPerRequest: null, // ✅ Required for BullMQ
});
const emailQueue = new Queue('emailQueue', { connection });
module.exports = emailQueue;
