// const { Queue } = require("bullmq");
// const Redis = require("ioredis");

// const connection = new Redis({
//   maxRetriesPerRequest: null,
// });

// const emailQueue = new Queue("emailQueue", { connection });

// async function checkQueueStatus() {
//   const waiting = await emailQueue.getWaitingCount();
//   const active = await emailQueue.getActiveCount();
//   const delayed = await emailQueue.getDelayedCount();
//   const failed = await emailQueue.getFailedCount();
//   const completed = await emailQueue.getCompletedCount();

//   console.log({
//     waiting,
//     active,
//     delayed,
//     failed,
//     completed,
//   });
// }

// checkQueueStatus();

const { Queue } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis({ maxRetriesPerRequest: null });
const emailQueue = new Queue("emailQueue", { connection });

async function getFailedJobs() {
  const failedJobs = await emailQueue.getFailed();
  if (failedJobs.length === 0) {
    console.log("No failed jobs.");
    return;
  }

  failedJobs.forEach((job) => {
    console.log(`Job ID: ${job.id}`);
    console.log(`Failed Reason: ${job.failedReason}`);
    console.log(`Job Data:`, job.data);
  });
}

getFailedJobs();
