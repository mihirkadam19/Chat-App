import testQueue from "../lib/redis.js";

testQueue.process(async (job) => {
    console.log(`🔄 Processing job ${job.id}:`, job.data);
    
    
  
    console.log(`✅ Job ${job.id} completed`);
  });