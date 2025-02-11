import Queue from 'bull';
import { config } from 'dotenv';

config();

const redisOptions = {
  redis: {
    host: process.env.REDIS_HOST, 
    port: Number(process.env.REDIS_PORT) || 6379, 
    password: process.env.REDIS_PASSWORD,
    tls: {} // Required for Upstash
  }
};

const postSingupQueue = new Queue('postSignupQueue', redisOptions);

// Access the internal Redis instance
const client = postSingupQueue.client;

// Listen for connection success
client.on('connect', () => {
  console.log('✅ Redis connected successfully!');
});

// Listen for errors
client.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export default postSingupQueue;
