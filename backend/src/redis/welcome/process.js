import { config } from 'dotenv';
import { sendMessageJob } from '../job.js';
import postSingupQueue from './queue.js';
import { connectDB } from "../../lib/db.js";
config();


postSingupQueue.process(async (job) => {
    console.log(`Processing job ${job.id}:`);
    connectDB();
    if (!job.data.userId) {
        console.error(`Job ${job.id} missing receiverID`);
        return;
    }

    const messages = [
        "Greetings, I am Mihir Kadam, the developer of this website.",
        "Click the prompt below to translate to your preferred language",
        "You can close this chat now and continue exploring!"
    ]
    
    await sendMessageJob(job.data.userId, messages);
    console.log(`Job ${job.id} completed`);
});
