const amqp = require("amqplib");

const rabbitSettings = {
    protocol: 'amqp',
    hostname: process.env.RABBIT_HOST || 'localhost',
    port: process.env.RABBIT_PORT || 5672,
    username: process.env.RABBIT_USER || 'guest',
    password: process.env.RABBIT_PASSWORD || 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}

connect();

async function connect(){

    const queue = 'employees'; 
    const newQueue = 'clients';     

    const msgs = [
        {"name":"youtube","enterprise":"youtube"},
        {"name":"facebook","enterprise":"facebook"},
        {"name":"twiter","enterprise":"twiter"},
    ]

    try{
        const conn = await amqp.connect(process.env.AMQP_URL || 'amqp://guest:guest@rabbitmq:5672');
        console.log("connection created");

        const channel = await conn.createChannel();
        console.log("channel created");

        let res = await channel.assertQueue(queue);
        console.log("queue 1 created");

        for(let msg in msgs){
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgs[msg])));
            console.log(`message sent to queue ${queue}`);
        }

        res = await channel.assertQueue(newQueue);
        console.log("queue 2 created");

        for(let msg in msgs){
            channel.sendToQueue(newQueue, Buffer.from(JSON.stringify(msgs[msg])));
            console.log(`message sent to queue ${newQueue}`);
        }

    }catch(err){
        console.error("error",err);
    }
}