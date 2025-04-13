require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { sendWelcomeMail } = require('../sendWelcomeMail');
const { sendThanksForSubscription } = require('../sendThanksForBuyingSubscription');
const { sendFreeTrialStarted } = require('../sendFreeTrialStarted');
const { sendPaymentMail } = require('../sendPaymentMail');
const { sendOTPMail } = require('../sendOTPMail');
const { paymentPageSuccess } = require('../paymentPageSuccess');
const { paymentPageCreated } = require('../paymentPageCreated');

const connection = new Redis({ maxRetriesPerRequest: null });

// Handle Redis errors
connection.on("error", (err) => {
    console.error("Redis connection error:", err);
});

const emailWorker = new Worker(
    'emailQueue',
    async (job) => {
        console.log("Processing job:", job.name, "Job ID:", job.id);
        try {
            const { name='', email='', amount=0, otp = '', blockchain='', token='', from_wallet_address='', transaction_hash='', webhook_url='', txTime='', transactionURL='',
                collectedEmail, collectedPhone, collectedAddress, collectedName, Amount, session_id, date, business_name
            } = job.data;

            console.log("Job data received:", job.data);

            switch (job.name) {
                case 'sendWelcomeMail':
                    await sendWelcomeMail(name, email);
                    break;
                case 'sendFreeTrialStarted':
                    await sendFreeTrialStarted(name, email);
                    break;
                case 'sendPaymentMail':
                    await sendPaymentMail(name, amount, blockchain, token, from_wallet_address, transaction_hash, webhook_url, txTime, transactionURL);
                    break;
                case 'sendOTPMail':
                    await sendOTPMail(name, email, otp);
                    break;
                default:
                    console.error("Unknown job type:", job.name);
            }
            console.log("Job completed successfully:", job.name, "Job ID:", job.id);
        } catch (error) {
            console.error("Error processing job:", job.name, "Job ID:", job.id);
            console.error("Error details:", error);
            throw error; // Re-throw to mark job as failed
        }
    },
    { 
        connection,
        concurrency: 5, // Process up to 5 jobs at once
        removeOnComplete: {
            age: 24 * 3600, // Keep completed jobs for 24 hours
            count: 1000, // Keep the last 1000 completed jobs
        },
        removeOnFail: {
            age: 24 * 3600 // Keep failed jobs for 24 hours
        }
    }
);

emailWorker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err);
});

console.log('Email worker running...');
