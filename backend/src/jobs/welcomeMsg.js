import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import postSingupQueue from '../lib/redis.js';
import { config } from 'dotenv';
config();

// Backend endpoints
const LOGIN_URL = 'http://localhost:5001/api/auth/login';
const MESSAGE_URL = 'http://localhost:5001/api/message/send/';
const LOGOUT_URL = 'http://localhost:5001/api/auth/logout';

// Create a cookie jar to persist cookies across requests
const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

// User credentials (replace with actual ones)
const credentials = {
    email: process.env.WELCOME_USER_EMAIL,
    password: process.env.WELCOME_USER_PASSWORD
};

const sendMessage = async (receiverID, messageData) => {
    try {
        // Step 1: Log in to get authentication cookies
        const loginResponse = await client.post(LOGIN_URL, credentials);

        if (loginResponse.status === 200) {
            console.log('Logged in successfully');
            
            const cookies = await jar.getCookies(LOGIN_URL); 
            console.log("Cookies after login:", cookies);          

            const messageResponse = await client.post(`${MESSAGE_URL}${receiverID}`, messageData);

            if (messageResponse.status === 200) {
                console.log('Message sent:', messageResponse.data);
            } else {
                console.error('Failed to send message:', messageResponse.data);
            }
        } else {
            console.error('Login failed:', loginResponse.data);
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    } finally {
        const logoutResponse = await client.post(LOGOUT_URL);
        console.log("logged out");
    }
};
/*
Redis disabled
postSingupQueue.process(async (job) => {
    console.log(`Processing job ${job.id}:`, job.data);

    if (!job.data.userId) {
        console.error(`Job ${job.id} missing receiverID`);
        return;
    }
    const greetings = {
        text: "Greetings, I am Mihir Kadam, the developer of this website."
    };

    const translateMsg = {
        text: "Click the prompt below to translate to your preferred language"
    }

    const closeChatMsg = {
        text: "You can close this chat now and continue exploring!"
    }
    await sendMessage(job.data.userId, greetings);
    await sendMessage(job.data.userId, translateMsg);
    await sendMessage(job.data.userId, closeChatMsg);
    console.log(`Job ${job.id} completed`);
});
*/