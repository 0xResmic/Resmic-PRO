const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({
    maxRetriesPerRequest: null,
});

const emailQueue = new Queue('emailQueue', { connection });

async function checkQueue() {
    try {
        console.log('\nChecking queue status...');
        
        // Get counts
        const waiting = await emailQueue.getWaitingCount();
        const active = await emailQueue.getActiveCount();
        const completed = await emailQueue.getCompletedCount();
        const failed = await emailQueue.getFailedCount();
        const delayed = await emailQueue.getDelayedCount();
        
        console.log({
            waiting,
            active,
            completed,
            failed,
            delayed
        });

        // Get waiting jobs
        const waitingJobs = await emailQueue.getWaiting();
        console.log('\nWaiting Jobs:', waitingJobs.length);
        for (const job of waitingJobs) {
            console.log(`- Job ID: ${job.id}, Name: ${job.name}`);
            console.log('  Data:', job.data);
        }

        // Get failed jobs
        const failedJobs = await emailQueue.getFailed();
        console.log('\nFailed Jobs:', failedJobs.length);
        for (const job of failedJobs) {
            console.log(`- Job ID: ${job.id}, Name: ${job.name}`);
            console.log('  Failed Reason:', job.failedReason);
            console.log('  Data:', job.data);
        }

    } catch (error) {
        console.error('Error checking queue:', error);
    } finally {
        await connection.quit();
    }
}

checkQueue(); 